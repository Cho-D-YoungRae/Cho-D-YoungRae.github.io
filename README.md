# 심플스택

[Docusaurus](https://docusaurus.io/) 기반 개발자 기술 블로그.

## 개발

```bash
npm install   # 의존성 설치
npm start     # 개발 서버 (http://localhost:3000)
```

## 빌드 및 확인

```bash
npm run build   # 프로덕션 빌드
npm run serve   # 빌드 결과 로컬 확인
```

## 배포

`main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드·배포합니다.

---

## 블로그 사용법

### 게시글 작성

`blog/` 디렉토리에 Markdown 파일을 생성합니다.

**파일명 규칙**: `YYYY-MM-DD-슬러그.md` (예: `2026-02-15-hello-world.md`)

**Front matter 예시**:

```yaml
---
title: "게시글 제목"
tags: [tag1, tag2]
description: "게시글 요약 (SEO/OG 메타에 사용)"
date: 2026-02-15
slug: hello-world        # 선택. 생략 시 파일명에서 자동 생성
draft: true              # 선택. 초안 (프로덕션 빌드에서 제외)
unlisted: true           # 선택. 숨김 (목록 미노출, URL 직접 접근만 가능)
---
```

**본문 요약 구분선**: `<!-- truncate -->` 를 삽입하면 그 위의 내용이 목록 페이지의 요약으로 표시됩니다.

> 자세한 front matter 옵션: [Docusaurus Blog - Header options](https://docusaurus.io/docs/blog#header-options)

### 코드 블록

````markdown
```javascript title="example.js" showLineNumbers {1,4-6}
// 줄 강조, 줄 번호, 타이틀을 지원합니다
```
````

> 자세한 코드 블록 기능: [Docusaurus Markdown - Code blocks](https://docusaurus.io/docs/markdown-features/code-blocks)

### 초안 / 숨김

| 상태 | front matter      | 목록 노출 | URL 접근 | 검색/피드/사이트맵 |
|------|-------------------|----------|---------|-------------------|
| 발행 | (기본값)           | O        | O       | O                 |
| 초안 | `draft: true`     | X        | X       | X                 |
| 숨김 | `unlisted: true`  | X        | O       | X                 |

> 자세한 설명: [Docusaurus Blog - Draft](https://docusaurus.io/docs/blog#draft), [Unlisted](https://docusaurus.io/docs/blog#unlisted)

---

## 운영 규칙

### 1. 글 작성 → 발행 라이프사이클

1. **초안 단계**: 글 작성 중에는 `draft: true`로 관리. 프로덕션 빌드에 포함되지 않음
2. **검수/미리공유 단계** (선택): 외부에 링크로만 공유할 경우 `unlisted: true`로 전환
3. **발행 단계**: `draft` / `unlisted` 제거 후 공개 발행
4. **수정 단계**: 오탈자·내용 보강 시 URL(slug)을 유지하는 방향 우선

### 2. URL(슬러그) 정책

- 슬러그는 가능한 한 **고정** — 제목이 바뀌어도 URL은 유지
- 슬러그를 변경했다면 **반드시 리다이렉트 규칙을 추가**하여 기존 링크가 깨지지 않게 유지

### 3. 태그 운영 규칙

- 글당 태그 **2~5개** 권장
- 태그 네이밍 통일: **소문자, 하이픈** 구분 (예: `spring-batch`, `clean-code`)
- 과도하게 세분화된 태그는 지양 — 탐색에 도움이 되는 수준으로 유지

### 4. 메타데이터 / SEO

- 발행 글은 `description`(요약) **필수**
- 글 수정 시 URL은 그대로 유지
- 초안/숨김 글은 검색 엔진에 노출되지 않음 (Docusaurus 기본 동작)

### 5. 배포 전 체크리스트

- [ ] `npm run build && npm run serve`로 프로덕션 빌드 확인
- [ ] 내부/외부 링크 깨짐 여부 확인
- [ ] 코드 블록 / 이미지 렌더링 확인
- [ ] 슬러그 변경이 있었다면 리다이렉트 추가 확인

### 6. 유지보수 루틴 (정기)

- 태그 정리 (중복·오타 태그 병합)
- 오래된 글 상단에 업데이트 안내 메모 (선택)
- 검색 인덱스 / 사이트맵 / 피드 정상 생성 확인