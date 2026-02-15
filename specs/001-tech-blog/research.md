# Research: 심플스택 기술 블로그

**Feature Branch**: `001-tech-blog`
**Date**: 2026-02-15
**Spec**: [spec.md](./spec.md)

## R-001: Docusaurus Blog-Only 모드 설정

**Decision**: `docs: false` + `blog.routeBasePath: '/'` 로 블로그를 사이트 루트로 설정

**Rationale**:
- Docusaurus preset-classic에서 `docs: false`로 docs 플러그인을 완전히 비활성화 가능
- `blog.routeBasePath: '/'`로 블로그 목록 페이지를 사이트 루트(`/`)에서 서빙
- 별도 랜딩 페이지(`src/pages/index.tsx`) 불필요 — 블로그 목록이 메인 페이지 역할
- `src/pages/` 디렉토리의 `index.tsx`가 남아있으면 라우트 충돌 발생하므로 반드시 제거

**Alternatives considered**:
- docs-only 모드 → 블로그 목적에 부적합
- 커스텀 랜딩 페이지 + `/blog` 라우트 → 불필요한 복잡성, 사용자가 단순함 요구

## R-002: 검색 플러그인 선택

**Decision**: `@easyops-cn/docusaurus-search-local` (v0.55.0) 사용

**Rationale**:
- GitHub Pages 정적 호스팅 환경에서 서버 검색 불가능
- 클라이언트 사이드 정적 검색 방식으로 lunr.js 기반 인덱싱
- Docusaurus 생태계에서 가장 널리 사용되는 로컬 검색 솔루션
- `themes` 배열에 추가하는 방식으로 설정이 간단
- 블로그 전용 설정 지원: `indexDocs: false`, `indexBlog: true`
- 한국어 지원: `language: ["en", "ko"]` (CJK 분리 지원)

**Alternatives considered**:
- Algolia DocSearch → 무료 플랜은 오픈소스 문서 전용, 개인 블로그 부적합
- 자체 검색 구현 → 불필요한 복잡성
- 검색 미제공 → FR-009 요구사항 불충족

## R-003: RSS/Atom 피드 설정

**Decision**: preset-classic의 blog 플러그인 내장 feedOptions 활용

**Rationale**:
- Docusaurus blog 플러그인이 RSS 2.0, Atom 피드를 기본 지원
- `feedOptions.type: 'all'`로 RSS, Atom, JSON 피드 모두 활성화
- 현재 `docusaurus.config.ts`에 이미 `type: ['rss', 'atom']` 설정되어 있음
- 추가 플러그인 설치 불필요

**Alternatives considered**:
- 별도 피드 생성 플러그인 → 불필요, 내장 기능으로 충분

## R-004: 사이트맵 생성

**Decision**: preset-classic 내장 `@docusaurus/plugin-sitemap` 활용

**Rationale**:
- preset-classic에 sitemap 플러그인이 기본 포함
- `docusaurus.config.ts`에서 `url` 필드를 올바르게 설정하면 자동 생성
- `changefreq`, `priority` 등 옵션 커스터마이징 가능
- 별도 설치 불필요, config에서 `sitemap` 옵션 명시만 필요

**Alternatives considered**:
- 수동 sitemap 생성 → 불필요한 복잡성

## R-005: 코드 블록 기능 (복사 버튼, 줄 번호, 줄 강조)

**Decision**: Docusaurus 내장 Prism 설정으로 모두 지원

**Rationale**:
- **문법 강조**: `prism-react-renderer` 기본 포함. `theme`/`darkTheme` 설정으로 테마 적용
- **줄 강조**: 코드 블록 메타스트링에 `{1,4-6}` 형태로 줄 번호 지정. `magicComments`(highlight-next-line 등) 기본 지원
- **줄 번호**: 코드 블록 메타스트링에 `showLineNumbers` 추가로 활성화
- **복사 버튼**: Docusaurus 3.x에서 `themeConfig.prism` 관련 코드 블록에 복사 버튼 기본 포함
- `additionalLanguages`로 추가 언어 지원 가능

**Alternatives considered**:
- 별도 코드 하이라이트 라이브러리 → 불필요, 내장 기능으로 FR-023 충족

## R-006: GitHub Pages 배포

**Decision**: GitHub Actions 워크플로우로 자동 배포

**Rationale**:
- `actions/checkout@v4` → `actions/setup-node@v4` → `npm ci` → `npm run build` → `actions/upload-pages-artifact@v3` → `actions/deploy-pages@v4`
- GitHub Pages 배포 소스를 "GitHub Actions"로 설정
- `push to main` 이벤트 트리거로 자동 배포
- PR에 대한 테스트 빌드도 별도 워크플로우로 구성 가능

**Alternatives considered**:
- `docusaurus deploy` 명령 (gh-pages 브랜치 방식) → GitHub Actions가 더 현대적이고 유연
- 수동 배포 → 자동화 필요

## R-007: 다크/라이트 모드

**Decision**: Docusaurus 내장 `colorMode.respectPrefersColorScheme: true` 활용

**Rationale**:
- 이미 `docusaurus.config.ts`에 설정되어 있음
- 시스템 설정에 따라 자동 전환
- 사용자가 수동으로 토글도 가능 (navbar 토글 기본 제공)
- FR-019 충족

**Alternatives considered**:
- 커스텀 다크모드 구현 → 불필요

## R-008: OG/Twitter 메타데이터

**Decision**: Docusaurus 내장 SEO 기능 + `themeConfig.image` + front matter 활용

**Rationale**:
- `themeConfig.image`로 기본 OG 이미지 설정 (모든 페이지 공통)
- Docusaurus가 각 페이지에 자동으로 OG/Twitter 메타태그 생성
- 게시글별 `description` front matter로 페이지별 설명 커스터마이징
- `themeConfig.metadata`로 추가 메타태그 설정 가능

**Alternatives considered**:
- 별도 SEO 플러그인 → 불필요, 내장 기능으로 충분

## R-009: 기본 템플릿 정리 대상

**Decision**: docs 관련 파일 및 샘플 데이터 전체 제거

**삭제 대상**:
- `docs/` 디렉토리 전체 (tutorial-basics, tutorial-extras, intro.md)
- `sidebars.ts` (docs 사이드바 설정)
- `src/pages/index.tsx` (기본 홈페이지 — 블로그가 루트)
- `src/pages/index.module.css` (홈페이지 스타일)
- `src/pages/markdown-page.md` (샘플 페이지)
- `src/components/HomepageFeatures/` (기본 컴포넌트)
- `blog/2019-05-28-first-blog-post.md` (샘플 포스트)
- `blog/2019-05-29-long-blog-post.md` (샘플 포스트)
- `blog/2021-08-01-mdx-blog-post.mdx` (샘플 포스트)
- `blog/2021-08-26-welcome/` (샘플 포스트 디렉토리)
- `blog/authors.yml` (단일 작성자, authors 미사용으로 삭제)
- `blog/tags.yml` (샘플 태그 → 삭제, 인라인 태그 사용)
- `static/img/docusaurus-social-card.jpg` (기본 소셜 카드)
- `static/img/docusaurus.png` (기본 로고)
- `static/img/logo.svg` (기본 로고)
- `static/img/undraw_docusaurus_mountain.svg` (기본 일러스트)
- `static/img/undraw_docusaurus_react.svg` (기본 일러스트)
- `static/img/undraw_docusaurus_tree.svg` (기본 일러스트)

**유지 대상**:
- `static/img/favicon.ico` → 새 이미지로 교체
- `static/img/20260214_...png` → `simplestack-logo.png`으로 이름 변경

## R-010: 이미지 전략

**Decision**: 사용자 제공 이미지를 블로그 로고, 파비콘, OG 이미지로 활용

**Rationale**:
- 이미지: 코드 아이콘(`</>`)이 있는 스택 형태의 진한 남색 로고
- `simplestack-logo.png` — 블로그 로고(navbar) 및 OG 소셜 카드 이미지로 사용
- 파비콘은 동일 이미지에서 변환하여 사용 (png → ico 변환 또는 png 직접 사용)

**Alternatives considered**:
- 별도 이미지 제작 → 사용자가 이미 이미지를 제공함

## R-011: i18n 설정

**Decision**: `defaultLocale: 'ko'`, `locales: ['ko']` 설정

**Rationale**:
- 블로그의 주요 언어는 한국어 (spec Assumptions)
- `html lang="ko"` 설정으로 SEO 및 접근성 향상
- 다국어 지원은 범위 외

## R-012: 네비게이션 구조

**Decision**: Navbar에 블로그(메인), 태그, 아카이브, GitHub 링크 배치

**구조**:
- 왼쪽: `심플스택` (로고 + 사이트명, 루트 링크)
- 왼쪽: `태그` (`/tags`), `아카이브` (`/archive`)
- 오른쪽: GitHub 링크 (`https://github.com/Cho-D-YoungRae`), Email 링크 (`mailto:yrc9229@gmail.com`)
- 검색바는 검색 플러그인이 자동으로 navbar에 추가
- 단일 작성자이므로 `authors.yml` 미사용, 게시글에 작성자 정보 미표시. navbar의 GitHub/Email이 작성자 정보 역할