---
title: "비동기 작업 중 EntityManagerFactory가 닫혔다"
pubDatetime: 2026-10-22T22:00:00+09:00
description: "await-termination: true로 설정했는데도 종료 중에 @Async 작업이 EntityManagerFactory가 닫혀 실패한 원인을 Spring 종료 단계로 살펴본다"
tags: [Spring, Troubleshooting]
---

`await-termination` 설정을 해두어서 문제가 없을 것이라고 생각했던 비동기 작업 중에 문제가 발생했다.

관련해서 원인을 살펴보고 정리하려 한다.

## 문제 상황

`@Async`를 통해서 처리하고 있는 작업들이 있었고 그 작업에는 DB 데이터 저장이 포함되어 있었다.

스프링부트를 통해서(`TaskExecutionAutoConfiguration`) 스레드풀(`ThreadPoolTaskExecutor`)을 생성중이었는데 아래와 같이 설정해두어서 비동기 작업이 정상적으로 완료된 뒤 애플리케이션이 종료될 것이라고 생각했다.

```yaml {10-11} showLineNumbers title="application.yml"
spring:
  task:
    execution:
      thread-name-prefix: "core-task-"
      pool:
        core-size: 10
        max-size: 10
        queue-capacity: 10000
      shutdown:
        await-termination: true
        await-termination-period: 10000
```

그러나 애플리케이션이 종료될 때 실행 중이던 비동기 작업이 도중에 `EntityManagerFactory`가 닫히면서 실패했고, 재시도 경로가 없어 사실상 유실됐다.

```text
org.springframework.dao.InvalidDataAccessApiUsageException: EntityManagerFactory is closed
```

## Spring에서의 자원정리

Spring 에서는 다음과 같은 단계로 종료가 된다.

```text
① ContextClosedEvent 발행          ← 아직 모든 것이 정상 동작
② Lifecycle stop (phase 높은 순)    ← "동작"이 멈춤 (빈 객체는 아직 살아 있음)
③ destroyBeans()                   ← 빈 자체가 소멸 (EMF, DataSource, Rabbit 커넥션 …)
```

②에서는 SmartLifecycle 빈이 phase 값이 큰 것부터 멈춘다.

|phase|대상|
|---|---|
|`Integer.MAX_VALUE`|Rabbit 리스너 컨테이너 (spring-rabbit 3.2.6 기본값)|
|`MAX_VALUE − 1024`|톰캣 graceful shutdown|

executor `await-termination` 에 따른 종료

|단계|`await-termination: true`|`await-termination: false`|
|---|---|---|
|① ContextClosedEvent|`lateShutdown = true` 표시만 함: 새 작업도 계속 받음|`executor.shutdown()`: 새 작업 거절|
|② Lifecycle stop (executor phase `MAX_VALUE/2`)|바로 통과|실행 중인 작업이 끝날 때까지 대기 (`timeout-per-shutdown-phase`, 기본 30초)|
|③ destroyBeans|`shutdown()` 후 여기서 처음으로 대기 → 이미 소멸된 빈이 있을 수 있음|`shutdownNow()`: 큐에 남은 작업은 버림|

await-termination: true면 executor는 ③에서야 작업 종료를 기다린다. 그런데 ③에서는 의존 관계가 없는 빈끼리 생성 순서의 역순으로 소멸되고, 이번에는 EMF가 executor보다 먼저 닫혔다. 결국 executor가 기다리는 동안 실행된 작업은 이미 닫힌 EMF를 쓰게 됐다.

## 해결 방법

`ContextClosedEvent`를 받아 executor를 직접 먼저 정리하면, 다른 빈이 소멸되기 전에 작업을 끝낼 수 있다. 대신 그 이후에 들어오는 `@Async` 제출은 `TaskRejectedException`으로 거절되고, ②에서 톰캣 graceful shutdown이 끝나기 전까지는 HTTP 요청이 계속 들어올 수 있다. 다만 거절은 호출자에게 오류로 드러나므로, 조용히 유실되는 것보다는 대응하기 쉽다.

비동기 작업은 유실될 수 있다. 그래서 작업 완료가 보장되어야 한다면, 애플리케이션이 뜨면서 완료되지 않은 작업을 처리하도록 하는 등의 방법도 생각해볼 수 있을 것 같다.

## 참고

- 스프링부트 version 3.5.5
