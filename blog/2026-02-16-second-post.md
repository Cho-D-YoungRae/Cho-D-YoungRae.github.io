---
title: "Docusaurus로 기술 블로그 만들기"
tags: [docusaurus, tutorial]
description: "Docusaurus를 사용하여 GitHub Pages에 기술 블로그를 구축하는 과정을 정리합니다."
date: 2026-02-16
---

Docusaurus를 사용하여 기술 블로그를 구축하는 과정을 공유합니다.

<!-- truncate -->

## Docusaurus 소개

Docusaurus는 Meta에서 개발한 정적 사이트 생성기입니다. Markdown 기반의 블로그와 문서 사이트를 쉽게 만들 수 있습니다.

### 주요 특징

- Markdown/MDX 기반 콘텐츠 관리
- 블로그 기능 내장 (태그, 아카이브, RSS 피드)
- 다크/라이트 모드 지원
- SEO 최적화

## 설정 과정

기본 프로젝트를 생성하고 블로그 전용 모드로 설정하면 됩니다.

```typescript showLineNumbers title="docusaurus.config.ts"
const config: Config = {
  title: '심플스택',
  presets: [
    ['classic', {
      docs: false,
      blog: {
        routeBasePath: '/',
      },
    }],
  ],
};
```

## 마무리

Docusaurus는 개발자 기술 블로그를 만들기에 적합한 도구입니다.
