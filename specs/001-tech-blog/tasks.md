# Tasks: 심플스택 기술 블로그

**Input**: Design documents from `/specs/001-tech-blog/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: 테스트는 `npm run build`를 통한 빌드 검증과 브라우저 수동 테스트로 수행한다. 별도 테스트 프레임워크 미사용.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (기본 템플릿 정리)

**Purpose**: Docusaurus 기본 생성 파일 중 불필요한 것을 제거하고 이미지를 정리한다.

- [x] T001 docs/ 디렉토리 전체 삭제
- [x] T002 [P] sidebars.ts 삭제
- [x] T003 [P] src/pages/index.tsx 삭제
- [x] T004 [P] src/pages/index.module.css 삭제
- [x] T005 [P] src/pages/markdown-page.md 삭제
- [x] T006 [P] src/components/HomepageFeatures/ 디렉토리 전체 삭제
- [x] T007 [P] blog/2019-05-28-first-blog-post.md 삭제
- [x] T008 [P] blog/2019-05-29-long-blog-post.md 삭제
- [x] T009 [P] blog/2021-08-01-mdx-blog-post.mdx 삭제
- [x] T010 [P] blog/2021-08-26-welcome/ 디렉토리 전체 삭제
- [x] T011 [P] blog/authors.yml 삭제
- [x] T012 [P] blog/tags.yml 삭제
- [x] T013 [P] static/img/docusaurus-social-card.jpg 삭제
- [x] T014 [P] static/img/docusaurus.png 삭제
- [x] T015 [P] static/img/logo.svg 삭제
- [x] T016 [P] static/img/undraw_docusaurus_mountain.svg 삭제
- [x] T017 [P] static/img/undraw_docusaurus_react.svg 삭제
- [x] T018 [P] static/img/undraw_docusaurus_tree.svg 삭제
- [x] T019 [P] static/img/favicon.ico 삭제
- [x] T020 static/img/20260214_1619_Image Generation_simple_compose_01khdg931gfj4rrhxtnv5z63bv.png → static/img/simplestack-logo.png 으로 이름 변경

---

## Phase 2: Foundational (Docusaurus 핵심 설정)

**Purpose**: `docusaurus.config.ts`와 `src/css/custom.css`를 블로그 전용으로 전면 재구성한다. 모든 User Story의 기반이 되는 설정이다.

**⚠️ CRITICAL**: Phase 1 완료 후 진행. 이 Phase가 완료되어야 모든 User Story 작업이 가능하다.

- [x] T021 docusaurus.config.ts 전면 재구성 — 사이트 메타데이터 설정 (title: '심플스택', tagline, favicon, url: 'https://cho-d-youngrae.github.io', organizationName, projectName)
- [x] T022 docusaurus.config.ts — i18n 설정 (defaultLocale: 'ko', locales: ['ko'])
- [x] T023 docusaurus.config.ts — preset-classic의 docs를 false로 비활성화
- [x] T024 docusaurus.config.ts — blog 설정 (routeBasePath: '/', postsPerPage: 50, blogSidebarCount: 0, showReadingTime: false, feedOptions, onInlineTags: 'warn')
- [x] T025 docusaurus.config.ts — themeConfig.navbar 설정 (title: '심플스택', logo: simplestack-logo.png, items: [태그, 아카이브, GitHub, Email])
- [x] T026 docusaurus.config.ts — themeConfig.footer 설정 (style: 'dark', copyright만 포함)
- [x] T027 docusaurus.config.ts — themeConfig.image를 'img/simplestack-logo.png'으로 설정
- [x] T028 docusaurus.config.ts — themeConfig.colorMode 설정 (respectPrefersColorScheme: true)
- [x] T029 docusaurus.config.ts — themeConfig.prism 설정 (theme: github, darkTheme: dracula, additionalLanguages 필요 시 추가)
- [x] T030 docusaurus.config.ts — themeConfig.metadata에 Twitter Card 기본 메타 추가
- [x] T031 src/css/custom.css — Docusaurus 기본 Infima 스타일 유지 확인, 불필요한 기본 템플릿 코드만 정리 (커스터마이징은 추후 진행)

**Checkpoint**: `npm run build` 성공 확인. 블로그 전용 모드로 사이트 루트(/)에서 빈 블로그 목록 페이지가 표시되어야 한다.

---

## Phase 3: User Story 1 — 게시글 작성 및 발행 (Priority: P1) 🎯 MVP

**Goal**: 작성자가 Markdown으로 기술 게시글을 작성하고 발행할 수 있다. 게시글은 사이트 루트 목록에 표시되며, 상세 페이지에서 본문을 읽을 수 있다.

**Independent Test**: `npm run start`로 개발 서버 실행 → `/` (블로그 메인)에서 게시글 목록 확인 → 게시글 클릭하여 상세 페이지 확인 → 본문 내용, 날짜, 태그 표시 확인

### Implementation for User Story 1

- [x] T032 [US1] blog/2026-02-15-hello-world.md 샘플 게시글 작성 — front matter (title, tags, description, date) + 본문 + `<!-- truncate -->` 마커 포함
- [x] T033 [US1] `npm run build` 실행하여 빌드 성공 및 게시글 정상 생성 확인

**Checkpoint**: 블로그 메인(`/`)에 게시글 목록 표시, 게시글 상세 페이지 정상 표시, `<!-- truncate -->` 요약 동작 확인

---

## Phase 4: User Story 2 — 게시글 상태 관리: 초안/숨김 (Priority: P2)

**Goal**: 작성자가 게시글을 초안(Draft) 또는 숨김(Unlisted) 상태로 관리할 수 있다.

**Independent Test**: `npm run start`에서 draft 게시글이 표시되는지 확인 → `npm run build && npm run serve`에서 draft 게시글이 제외되는지 확인 → unlisted 게시글이 목록에서 숨겨지고 URL 직접 접근만 가능한지 확인

### Implementation for User Story 2

- [x] T034 [P] [US2] blog/2026-02-15-draft-example.md 초안 샘플 게시글 작성 (draft: true)
- [x] T035 [P] [US2] blog/2026-02-15-unlisted-example.md 숨김 샘플 게시글 작성 (unlisted: true)
- [x] T036 [US2] `npm run build` 실행하여 draft 제외, unlisted 목록 제외 확인

**Checkpoint**: 개발 서버에서 draft 게시글 표시 확인, 프로덕션 빌드에서 draft 제외 확인, unlisted 게시글 URL 직접 접근만 가능 확인

---

## Phase 5: User Story 3 — 가독성 기능: TOC/헤딩 앵커/코드 블록 (Priority: P3)

**Goal**: 게시글에서 목차(TOC), 헤딩 앵커 링크, 코드 블록(문법 강조/줄 번호/줄 강조/복사 버튼) 기능이 정상 동작한다.

**Independent Test**: 코드 블록과 다양한 헤딩이 포함된 게시글에서 → TOC 자동 생성 확인 → 헤딩 앵커 클릭 시 이동 확인 → 코드 블록 문법 강조 표시 확인 → `showLineNumbers` 줄 번호 표시 확인 → `{1,4-6}` 줄 강조 확인 → 복사 버튼 동작 확인

### Implementation for User Story 3

- [x] T037 [US3] blog/2026-02-15-hello-world.md에 다양한 헤딩 레벨(H2, H3), 코드 블록(문법 강조 + showLineNumbers + {줄 강조} + title), 인라인 코드 등 가독성 기능 테스트용 콘텐츠 추가
- [x] T038 [US3] `npm run build` 실행하여 가독성 기능 포함 빌드 정상 확인

**Checkpoint**: TOC 자동 생성, 헤딩 앵커 링크, 코드 블록 문법 강조/줄 번호/줄 강조/복사 버튼 모두 동작 확인

---

## Phase 6: User Story 4 + 5 — 태그 기반 탐색 + 아카이브 (Priority: P4, P5)

**Goal**: 게시글에 태그를 부여하고 태그 목록/태그별 게시글 목록 페이지가 자동 생성된다. 아카이브 페이지에서 연도별 게시글을 탐색할 수 있다.

**Independent Test**: `/tags`에서 태그 목록 표시 확인 → `/tags/[tag]`에서 태그별 게시글 목록 확인 → `/archive`에서 연도별 게시글 목록 확인 → navbar의 태그/아카이브 링크 동작 확인

### Implementation for User Story 4 + 5

- [x] T039 [P] [US4] [US5] blog/2026-02-16-second-post.md 추가 샘플 게시글 작성 — 기존 게시글과 다른 태그 조합 사용 (태그/아카이브 페이지 검증용)
- [x] T040 [US4] `npm run build` 실행하여 /tags 페이지 및 /tags/[tag] 페이지 정상 생성 확인
- [x] T041 [US5] `npm run build` 결과에서 /archive 페이지 정상 생성 확인

**Checkpoint**: `/tags` 태그 목록 페이지, `/tags/[tag]` 태그별 목록 페이지, `/archive` 아카이브 페이지 모두 정상 동작 확인

---

## Phase 7: User Story 6 — 게시글 검색 (Priority: P6)

**Goal**: 사용자가 게시글을 검색할 수 있다. 클라이언트 사이드 정적 검색으로 구현한다.

**Independent Test**: `npm run build && npm run serve`로 프로덕션 빌드 서빙 → navbar 검색바에서 키워드 입력 → 검색 결과에 관련 게시글 표시 확인

### Implementation for User Story 6

- [x] T042 [US6] @cmfcmf/docusaurus-search-local 패키지 설치 (npm install) — @easyops-cn 버전은 docs:false 비호환으로 @cmfcmf 버전으로 변경
- [x] T043 [US6] docusaurus.config.ts에 themes 배열 추가 — @cmfcmf/docusaurus-search-local 설정 (indexDocs: false, indexBlog: true, indexPages: false, language: 'en')
- [x] T044 [US6] `npm run build` 실행하여 검색 인덱스 생성 및 빌드 성공 확인

**Checkpoint**: 프로덕션 빌드에서 navbar 검색바 표시, 키워드 입력 시 검색 결과 정상 표시

---

## Phase 8: User Story 7 — SEO/메타데이터/사이트맵/RSS (Priority: P7)

**Goal**: 사이트맵, RSS/Atom 피드가 자동 생성되고, 각 페이지에 OG/Twitter 메타태그가 포함된다.

**Note**: 구현(feedOptions, themeConfig.image, themeConfig.metadata)은 Phase 2(T024, T027, T030)에서 완료됨. 이 Phase는 검증만 수행한다.

**Independent Test**: `npm run build` 후 build 디렉토리에서 → sitemap.xml 존재 확인 → rss.xml 유효성 확인 → atom.xml 유효성 확인 → 게시글 HTML에서 og:title, og:description, og:image, twitter:card 메타태그 존재 확인

### Verification for User Story 7

- [x] T045 [US7] `npm run build` 실행 후 build/sitemap.xml 생성 확인
- [x] T046 [US7] `npm run build` 실행 후 build/rss.xml 및 build/atom.xml 생성 및 유효성 확인
- [x] T047 [US7] `npm run build` 실행 후 게시글 HTML 파일에서 og:title, og:description, og:image, twitter:card 메타태그 존재 확인

**Checkpoint**: sitemap.xml, rss.xml, atom.xml 정상 생성, 게시글별 OG/Twitter 메타태그 포함 확인

---

## Phase 9: GitHub Pages 배포 자동화

**Purpose**: GitHub Actions 워크플로우를 구성하여 main 브랜치 push 시 자동 배포, PR 시 빌드 테스트를 수행한다.

- [x] T048 [P] .github/workflows/deploy.yml 생성 — main push 트리거, Node.js 20, npm ci, npm run build, actions/upload-pages-artifact@v3, actions/deploy-pages@v4
- [x] T049 [P] .github/workflows/test-deploy.yml 생성 — PR 트리거, Node.js 20, npm ci, npm run build (빌드 테스트만)

**Checkpoint**: 워크플로우 파일 문법 유효성 확인

---

## Phase 10: Polish & 최종 검증

**Purpose**: 전체 기능 통합 검증 및 샘플 게시글 정리

- [x] T050 draft/unlisted 샘플 게시글(blog/2026-02-15-draft-example.md, blog/2026-02-15-unlisted-example.md) 삭제 — 검증 완료 후 불필요
- [x] T051 `npm run build` 최종 빌드 성공 확인
- [x] T052 `npm run serve`로 로컬 프로덕션 서빙 후 전체 기능 수동 검증:
  - 블로그 메인, 게시글 상세, 태그, 아카이브, 검색, 다크/라이트 모드, 코드 블록, RSS/Atom, 사이트맵, OG 메타태그
  - Edge Case 검증: 태그 없는 게시글 표시, 헤딩 없는 글의 TOC 미표시, 숨김 게시글 사이트맵/피드 미포함, 초안 게시글 검색 인덱스 미포함
- [x] T053 quickstart.md 기반 사용 시나리오 검증 — 새 게시글 작성 → 빌드 → 확인 흐름 동작 확인

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — 즉시 시작 가능
- **Phase 2 (Foundational)**: Phase 1 완료 필수 — 라우트 충돌 방지를 위해 src/pages/index.tsx 삭제 후 진행
- **Phase 3-8 (User Stories)**: Phase 2 완료 필수 — docusaurus.config.ts 설정이 모든 기능의 기반
  - Phase 3 (US1): Phase 2 이후 즉시 시작 가능 — MVP
  - Phase 4 (US2): Phase 3 이후 (샘플 게시글 필요)
  - Phase 5 (US3): Phase 3 이후 (기존 게시글에 콘텐츠 추가)
  - Phase 6 (US4+5): Phase 3 이후 (태그 확인을 위한 복수 게시글 필요)
  - Phase 7 (US6): Phase 2 이후 시작 가능 (검색 플러그인은 독립적)
  - Phase 8 (US7): Phase 3 이후 (피드/사이트맵 생성에 게시글 필요)
- **Phase 9 (배포)**: Phase 2 이후 시작 가능 (워크플로우 파일은 독립적)
- **Phase 10 (Polish)**: 모든 Phase 완료 후 최종 검증

### User Story Dependencies

- **US1 (P1)**: Phase 2 이후 시작 가능 — 다른 Story에 의존 없음
- **US2 (P2)**: US1 이후 (빌드 검증을 위한 기본 게시글 필요)
- **US3 (P3)**: US1 이후 (기존 게시글에 가독성 콘텐츠 추가)
- **US4+5 (P4, P5)**: US1 이후 (복수 게시글 필요)
- **US6 (P6)**: Phase 2 이후 독립적으로 시작 가능 (검색 플러그인 설치)
- **US7 (P7)**: US1 이후 (피드/사이트맵에 게시글 데이터 필요)

### Parallel Opportunities

- **Phase 1**: T002~T019 모든 삭제 작업을 병렬로 실행 가능
- **Phase 2**: T021~T031 설정 작업은 모두 docusaurus.config.ts 단일 파일이므로 순차 실행 권장
- **Phase 3 이후**: US6(검색 플러그인)과 Phase 9(배포 워크플로우)는 다른 Story와 병렬 진행 가능
- **Phase 4**: T034, T035 draft/unlisted 샘플 게시글 병렬 작성 가능
- **Phase 9**: T048, T049 배포/테스트 워크플로우 병렬 작성 가능

---

## Parallel Example: Phase 1 (Setup)

```bash
# 모든 삭제 작업을 병렬로 실행:
Task: "docs/ 디렉토리 전체 삭제"
Task: "sidebars.ts 삭제"
Task: "src/pages/index.tsx 삭제"
Task: "src/pages/index.module.css 삭제"
Task: "src/pages/markdown-page.md 삭제"
Task: "src/components/HomepageFeatures/ 디렉토리 전체 삭제"
Task: "blog/ 샘플 파일 4개 삭제"
Task: "blog/authors.yml + blog/tags.yml 삭제"
Task: "static/img/ 기본 이미지 7개 삭제"
# 마지막으로 이미지 이름 변경 (삭제 완료 후):
Task: "simplestack-logo.png 이름 변경"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (기본 템플릿 정리)
2. Complete Phase 2: Foundational (docusaurus.config.ts 재구성)
3. Complete Phase 3: User Story 1 (샘플 게시글 + 빌드 검증)
4. **STOP and VALIDATE**: `npm run build && npm run serve`로 블로그 메인/상세 페이지 동작 확인
5. 최소한의 동작하는 블로그 완성

### Incremental Delivery

1. Phase 1 + 2 → 블로그 기반 구조 완성
2. Phase 3 (US1) → 게시글 작성/발행 가능 → **MVP!**
3. Phase 4 (US2) → 초안/숨김 상태 관리 추가
4. Phase 5 (US3) → 가독성 기능(코드 블록, TOC) 확인
5. Phase 6 (US4+5) → 태그/아카이브 탐색 기능 확인
6. Phase 7 (US6) → 검색 기능 추가
7. Phase 8 (US7) → SEO/피드/사이트맵 검증
8. Phase 9 → 자동 배포 구성
9. Phase 10 → 최종 정리 및 검증

---

## Notes

- [P] tasks = 서로 다른 파일, 의존성 없음 → 병렬 실행 가능
- [Story] label = 특정 User Story에 매핑 (추적용)
- Phase 2의 docusaurus.config.ts 설정은 논리적으로 분리했으나 단일 파일 편집이므로 실제로는 한 번에 작성하는 것이 효율적
- 별도 테스트 프레임워크 없음 — `npm run build` 빌드 검증 + 브라우저 수동 테스트
- Docusaurus 내장 기능을 최대한 활용하므로 대부분의 기능은 설정(config)으로 해결됨
- 각 Checkpoint에서 `npm run build` 성공 여부를 반드시 확인
- Total tasks: 53개
