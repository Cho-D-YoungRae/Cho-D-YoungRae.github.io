# 조D영래 기술블로그

> 🔗 **블로그**: https://cho-d-youngrae.github.io

[AstroPaper](https://github.com/satnaing/astro-paper) v6(Astro 6) 기반 한국어 기술 블로그.

## 개발

```bash
npm install     # 의존성 설치
npm run dev     # 개발 서버 (http://localhost:4321)
```

## 빌드 및 확인

```bash
npm run build   # 프로덕션 빌드 (astro check + Pagefind 인덱싱 포함)
npm run preview # 빌드 결과 로컬 확인
```

## 배포

`main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드·배포합니다 (`dist/` → GitHub Pages).

---

## 블로그 사용법

### 게시글 작성

`src/content/posts/` 디렉토리에 Markdown(`.md`) 파일을 생성합니다.

**파일명 규칙**: `YYYY-MM-DD-슬러그.md` (예: `2026-02-15-hello-world.md`) — 파일명이 곧 URL 슬러그가 됩니다.

**Front matter 예시**:

```yaml
---
title: "게시글 제목"
pubDatetime: 2026-02-15T09:00:00+09:00   # 필수. KST(+09:00) 명시 권장
description: "게시글 요약 (SEO/OG 메타에 사용)"  # 필수
tags: [tag1, tag2]        # 선택. 생략 시 ["others"]
draft: false              # 선택. true면 프로덕션 빌드에서 제외
featured: false           # 선택. true면 홈 추천 글 섹션에 노출
modDatetime: 2026-02-20T09:00:00+09:00   # 선택. 수정일
---
```

> 필수 필드는 `title`·`pubDatetime`·`description`이며, 누락 시 `astro check`(빌드)에서 오류로 잡힙니다.

### 코드 블록

[astro-expressive-code](https://expressive-code.com)로 타이틀·줄 강조·줄 번호를 지원합니다.

````markdown
```javascript title="example.js" showLineNumbers {1,4-6}
// 줄 강조({1,4-6}), 줄 번호(showLineNumbers), 파일명 타이틀
```
````

### 댓글 · 검색

- **댓글**: [Giscus](https://giscus.app)(GitHub Discussions 기반)가 글 상세 페이지에 적용됩니다.
- **검색**: [Pagefind](https://pagefind.app) 정적 검색이 빌드 시 자동 인덱싱됩니다.

---

## 운영 규칙

### 1. 글 작성 → 발행 라이프사이클

1. **초안 단계**: 작성 중에는 `draft: true`로 관리 (프로덕션 빌드에서 제외)
2. **발행 단계**: `draft` 제거(또는 `false`) 후 공개 발행
3. **수정 단계**: 오탈자·내용 보강 시 URL(파일명 슬러그)을 유지하는 방향 우선. 수정일은 `modDatetime`로 표기

### 2. URL(슬러그) 정책

- 슬러그(파일명)는 가능한 한 **고정** — 제목이 바뀌어도 URL은 유지
- 부득이 변경 시 기존 링크가 깨지지 않도록 리다이렉트를 고려

### 3. 태그 운영 규칙

- 글당 태그 **2~5개** 권장
- 태그 네이밍 통일: **소문자, 하이픈** 구분 (예: `spring-batch`, `clean-code`)
- 과도한 세분화 지양 — 탐색에 도움이 되는 수준으로 유지

### 4. 메타데이터 / SEO

- 발행 글은 `description`(요약) **필수**
- OG 이미지는 빌드 시 동적 생성(satori) — 별도 작업 불필요
- 초안(`draft`) 글은 빌드에서 제외되어 검색·피드·사이트맵에 노출되지 않음

### 5. 배포 전 체크리스트

- [ ] `npm run build && npm run preview`로 프로덕션 빌드 확인
- [ ] 내부/외부 링크 깨짐 여부 확인
- [ ] 코드 블록 / 이미지 렌더링, 다크모드 확인
- [ ] 슬러그 변경이 있었다면 리다이렉트 검토

### 6. 유지보수 루틴 (정기)

- 태그 정리 (중복·오타 태그 병합)
- Pagefind 검색 / 사이트맵 / RSS 피드 정상 생성 확인
- 의존성 업데이트 시 `npm run build`로 회귀 확인
