# Quick Start: 심플스택 기술 블로그

**Feature Branch**: `001-tech-blog`
**Date**: 2026-02-15

## 개발 환경 요구사항

- Node.js 20+
- npm (Node.js에 포함)
- Git

## 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (http://localhost:3000)
npm run start

# 프로덕션 빌드
npm run build

# 빌드 결과물 로컬 서빙 (http://localhost:3000)
npm run serve
```

## 게시글 작성

### 새 게시글 만들기

`blog/` 디렉토리에 Markdown 파일을 생성한다.

**파일명 규칙**: `YYYY-MM-DD-slug.md`

```markdown
---
title: "게시글 제목"
tags: [tag1, tag2]
description: "게시글 요약 설명 (SEO용, 160자 이내 권장)"
---

게시글 본문 시작...

<!-- truncate -->

여기부터는 목록에서 보이지 않는 본문 영역
```

### 이미지 포함 게시글

```
blog/
└── 2026-02-15-my-post/
    ├── index.md      # 게시글 본문
    └── screenshot.png # 이미지 파일
```

`index.md`에서 상대 경로로 참조:
```markdown
![스크린샷](./screenshot.png)
```

### 게시글 상태 관리

| 상태 | front matter | 동작 |
|------|-------------|------|
| 발행 | (기본값) | 모든 곳에 노출 |
| 초안 | `draft: true` | 프로덕션 빌드 제외, 개발 서버에서만 표시 |
| 숨김 | `unlisted: true` | 목록/피드/사이트맵 제외, URL 직접 접근만 가능 |

### 코드 블록 기능

````markdown
```javascript {1,4-6} showLineNumbers title="example.js"
import React from 'react';

function MyComponent(props) {
  if (props.isBar) {
    return <div>Bar</div>;
  }
  return <div>Foo</div>;
}

export default MyComponent;
```
````

- `{1,4-6}`: 1번째, 4~6번째 줄 하이라이트
- `showLineNumbers`: 줄 번호 표시
- `title="example.js"`: 코드 블록 제목

### 태그

front matter의 `tags` 필드에 배열로 작성:

```yaml
tags: [react, typescript, next-js]
```

- 태그 목록 페이지: `/tags`
- 태그별 게시글: `/tags/[tag-name]`

## 주요 URL

| URL | 설명 |
|-----|------|
| `/` | 블로그 메인 (게시글 목록) |
| `/tags` | 태그 목록 |
| `/archive` | 아카이브 (연도별) |
| `/rss.xml` | RSS 피드 |
| `/atom.xml` | Atom 피드 |
| `/sitemap.xml` | 사이트맵 |

## 배포

main 브랜치에 push하면 GitHub Actions가 자동으로 빌드 및 배포한다.

수동 빌드 확인:
```bash
npm run build
```
