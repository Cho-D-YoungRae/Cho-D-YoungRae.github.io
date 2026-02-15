# Implementation Plan: 심플스택 기술 블로그

**Branch**: `001-tech-blog` | **Date**: 2026-02-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-tech-blog/spec.md`

## Summary

Docusaurus 3.9.2 기반의 개인 기술 블로그 '심플스택'을 구축한다. 기본 생성된 Docusaurus 템플릿에서 docs 관련 코드를 모두 제거하고, 블로그 전용 모드로 전환한다. 게시글 작성/발행/초안/숨김, 태그, 아카이브, 검색, RSS/Atom 피드, 사이트맵, SEO 메타데이터, 코드 가독성 기능을 Docusaurus 내장 기능과 최소한의 플러그인으로 구현한다. GitHub Pages로 자동 배포한다.

## Technical Context

**Language/Version**: TypeScript 5.6, Node.js 20+, React 19
**Primary Dependencies**: Docusaurus 3.9.2 (`@docusaurus/preset-classic`), `@easyops-cn/docusaurus-search-local` (v0.55.0), `prism-react-renderer` 2.3
**Storage**: 파일 시스템 (Markdown/MDX + YAML)
**Testing**: `npm run build` (빌드 검증), 브라우저 수동 테스트 (`npm run start`)
**Target Platform**: GitHub Pages (정적 사이트 호스팅)
**Project Type**: 정적 사이트 (Docusaurus)
**Performance Goals**: 페이지 로딩 3초 이내 (SC-002)
**Constraints**: 정적 호스팅 전용 (서버 사이드 로직 불가), GitHub Pages
**Scale/Scope**: 단일 작성자, 게시글 수백 건 규모

## Constitution Check

*GATE: Constitution 파일 없음 — 기본 원칙으로 판정*

- **단순성 원칙**: PASS — Docusaurus 내장 기능 최대 활용, 추가 플러그인 1개(검색)만 사용
- **YAGNI 원칙**: PASS — 스펙에 정의된 기능만 구현, 시리즈/댓글/분석 등 제외
- **단일 프로젝트**: PASS — 별도 프로젝트 분리 없음

## Project Structure

### Documentation (this feature)

```text
specs/001-tech-blog/
├── plan.md              # 이 파일
├── research.md          # Phase 0: 기술 리서치
├── data-model.md        # Phase 1: 데이터 모델
├── quickstart.md        # Phase 1: 빠른 시작 가이드
└── tasks.md             # Phase 2: 구현 태스크 (/speckit.tasks)
```

### Source Code (repository root)

```text
/ (project root)
├── .github/
│   └── workflows/
│       ├── deploy.yml           # GitHub Pages 배포 워크플로우
│       └── test-deploy.yml      # PR 빌드 테스트 워크플로우
├── blog/                        # 게시글 Markdown 파일
├── src/
│   └── css/
│       └── custom.css           # 커스텀 스타일 (Infima 변수 오버라이드)
├── static/
│   └── img/
│       └── simplestack-logo.png # 블로그 로고/OG 이미지
├── docusaurus.config.ts         # 메인 설정 파일
├── package.json
└── tsconfig.json
```

**Structure Decision**: Docusaurus 표준 구조를 그대로 따른다. docs 관련 파일을 모두 제거하고 blog-only 모드로 운영한다. `src/pages/`와 `src/components/`의 기본 템플릿 파일은 제거한다. 추후 커스텀 페이지나 컴포넌트가 필요할 때 다시 생성한다.

## Implementation Phases

### Phase 1: 기본 템플릿 정리

기본 생성된 Docusaurus 파일 중 불필요한 것을 모두 제거한다.

**삭제 대상**:
| 파일/디렉토리 | 사유 |
|--------------|------|
| `docs/` 전체 | docs 미사용 |
| `sidebars.ts` | docs 사이드바 설정 |
| `src/pages/index.tsx` | 블로그가 루트이므로 불필요 (라우트 충돌 방지) |
| `src/pages/index.module.css` | 홈페이지 스타일 |
| `src/pages/markdown-page.md` | 샘플 페이지 |
| `src/components/HomepageFeatures/` | 기본 컴포넌트 |
| `blog/2019-05-28-first-blog-post.md` | 샘플 포스트 |
| `blog/2019-05-29-long-blog-post.md` | 샘플 포스트 |
| `blog/2021-08-01-mdx-blog-post.mdx` | 샘플 포스트 |
| `blog/2021-08-26-welcome/` | 샘플 포스트 디렉토리 |
| `blog/authors.yml` | 단일 작성자, authors 미사용 |
| `blog/tags.yml` | 인라인 태그 사용, 별도 파일 불필요 |
| `static/img/docusaurus-social-card.jpg` | 기본 소셜 카드 |
| `static/img/docusaurus.png` | 기본 로고 |
| `static/img/logo.svg` | 기본 로고 |
| `static/img/undraw_docusaurus_mountain.svg` | 기본 일러스트 |
| `static/img/undraw_docusaurus_react.svg` | 기본 일러스트 |
| `static/img/undraw_docusaurus_tree.svg` | 기본 일러스트 |
| `static/img/favicon.ico` | 새 이미지로 교체 |

**이미지 정리**:
- `20260214_...png` → `simplestack-logo.png`으로 이름 변경

### Phase 2: Docusaurus 핵심 설정

`docusaurus.config.ts`를 블로그 전용으로 전면 재구성한다.

**주요 변경 사항**:

| 설정 항목 | 현재값 | 변경값 |
|-----------|--------|--------|
| `title` | `'My Site'` | `'심플스택'` |
| `tagline` | `'Dinosaurs are cool'` | `'Cho-D-YoungRae의 기술 블로그'` |
| `favicon` | `'img/favicon.ico'` | `'img/simplestack-logo.png'` |
| `url` | `'https://your-docusaurus-site.example.com'` | `'https://cho-d-youngrae.github.io'` |
| `organizationName` | `'facebook'` | `'Cho-D-YoungRae'` |
| `projectName` | `'docusaurus'` | `'Cho-D-YoungRae.github.io'` |
| `i18n.defaultLocale` | `'en'` | `'ko'` |
| `i18n.locales` | `['en']` | `['ko']` |
| `presets.docs` | `{sidebarPath, editUrl}` | `false` |
| `presets.blog.routeBasePath` | (없음, 기본 `/blog`) | `'/'` |
| `presets.blog.postsPerPage` | (기본 10) | `50` |
| `presets.blog.feedOptions.type` | `['rss', 'atom']` | `'all'` |
| `presets.blog.feedOptions.copyright` | (없음) | `'Copyright © {year} Cho-D-YoungRae'` |
| `presets.blog.blogSidebarCount` | (기본 5) | `0` |
| `presets.blog.showReadingTime` | `true` | `false` |
| `presets.blog.onInlineAuthors` | `'warn'` | 제거 |
| `themeConfig.image` | `'img/docusaurus-social-card.jpg'` | `'img/simplestack-logo.png'` |
| `themeConfig.navbar` | Tutorial, Blog, GitHub(facebook) | 심플스택, 태그, 아카이브, GitHub+Email(개인) |
| `themeConfig.footer` | 복잡한 3컬럼 | 단순 copyright만 |
| `themeConfig.metadata` | (없음) | Twitter Card 기본 메타 추가 |

**Navbar 구조**:
```typescript
navbar: {
  title: '심플스택',
  logo: { alt: '심플스택 로고', src: 'img/simplestack-logo.png' },
  items: [
    { to: '/tags', label: '태그', position: 'left' },
    { to: '/archive', label: '아카이브', position: 'left' },
    { href: 'https://github.com/Cho-D-YoungRae', label: 'GitHub', position: 'right' },
    { href: 'mailto:yrc9229@gmail.com', label: 'Email', position: 'right' },
  ],
}
```

**Footer 구조**:
```typescript
footer: {
  style: 'dark',
  copyright: `Copyright © ${new Date().getFullYear()} Cho-D-YoungRae. Built with Docusaurus.`,
}
```

### Phase 3: 블로그 콘텐츠 초기화

**작성자 설정**: `authors.yml` 미사용. 단일 작성자이므로 게시글 front matter에 `authors` 필드를 생략하고, navbar의 GitHub/Email 링크로 작성자 정보를 제공한다.

**샘플 게시글** (빌드 검증용):
- `blog/2026-02-15-hello-world.md` — 블로그 시작을 알리는 첫 게시글
  - 태그, 코드 블록, 헤딩 등 주요 기능 포함
  - `authors` 필드 없이 작성

### Phase 4: 검색 플러그인 설치 및 설정

```bash
npm install @easyops-cn/docusaurus-search-local
```

`docusaurus.config.ts`에 themes 추가:
```typescript
themes: [
  [
    require.resolve('@easyops-cn/docusaurus-search-local'),
    {
      hashed: true,
      language: ['en', 'ko'],
      indexDocs: false,
      indexBlog: true,
      indexPages: false,
      blogRouteBasePath: '/',
    },
  ],
],
```

### Phase 5: 스타일 확인

`src/css/custom.css`는 Docusaurus 기본 Infima 스타일을 그대로 유지한다. 커스터마이징은 추후 별도 진행한다.

- 기본 제공 색상 변수, 레이아웃, 컴포넌트 위치를 변경하지 않는다
- 태그 표시 위치, TOC 위치 등 모든 UI 요소는 Docusaurus 기본 위치를 따른다

### Phase 6: GitHub Pages 배포 자동화

**.github/workflows/deploy.yml** — main 브랜치 push 시 자동 배포:
- `actions/checkout@v4`
- `actions/setup-node@v4` (Node.js 20)
- `npm ci`
- `npm run build`
- `actions/upload-pages-artifact@v3`
- `actions/deploy-pages@v4`

**.github/workflows/test-deploy.yml** — PR 시 빌드 테스트

### Phase 7: 빌드 검증

- `npm run build` 성공 확인
- `npm run serve`로 로컬에서 최종 확인
- 주요 검증 항목:
  - 블로그 메인 페이지 (루트) 정상 표시
  - 게시글 상세 페이지 정상 표시
  - 태그 페이지 정상 동작
  - 아카이브 페이지 정상 동작
  - 검색 기능 동작
  - RSS/Atom 피드 유효성
  - 사이트맵 생성 확인
  - OG/Twitter 메타태그 포함 확인
  - 다크/라이트 모드 전환
  - 코드 블록 문법 강조, 줄 번호, 복사 버튼

## Dependency Map

```
Phase 1 (정리) → Phase 2 (설정) → Phase 3 (콘텐츠) → Phase 7 (검증)
                       ↓                                    ↑
                 Phase 4 (검색) ──────────────────────────────┘
                       ↓
                 Phase 5 (스타일) ─────────────────────────────┘
                       ↓
                 Phase 6 (배포) ───────────────────────────────┘
```

Phase 1은 반드시 먼저 완료해야 한다 (라우트 충돌 방지). Phase 2~6은 의존 관계가 있으나, 일부는 병렬 가능하다.

## Complexity Tracking

> Constitution 위반 없음. 추가 정당화 불필요.

| 항목 | 판정 | 비고 |
|------|------|------|
| 추가 플러그인 | 1개 (검색) | 내장 기능으로 대체 불가, FR-009 충족 필수 |
| 커스텀 컴포넌트 | 0개 | Docusaurus 기본 테마만 사용 |
| 커스텀 페이지 | 0개 | 블로그 루트 모드로 불필요 |

## Key Decisions

| 결정 사항 | 선택 | 근거 |
|-----------|------|------|
| 블로그 루트 모드 | `routeBasePath: '/'` | 랜딩 페이지 불필요, 단순함 우선 |
| docs 비활성화 | `docs: false` | 블로그 전용, docs 불필요 |
| 검색 방식 | 정적 로컬 검색 | GitHub Pages 제약 |
| OG 이미지 | 단일 기본 이미지 | 스펙 합의 사항 |
| 페이지네이션 | 50개/페이지 | 스펙 합의 사항 |
| tags.yml | 미사용 | 인라인 태그로 충분 |
| authors.yml | 미사용 | 단일 작성자, navbar GitHub/Email로 대체 |
| 블로그 사이드바 | `blogSidebarCount: 0` | 단순한 디자인 우선 |
| UI/스타일 | Docusaurus 기본 유지 | 태그 위치, TOC 위치, 레이아웃 등 모든 UI 요소는 기본값 사용. 커스터마이징은 추후 별도 진행 |

## References

- [Docusaurus Blog Plugin](https://docusaurus.io/docs/blog)
- [Docusaurus Blog-Only Mode](https://docusaurus.io/docs/blog#blog-only-mode)
- [Docusaurus Code Blocks](https://docusaurus.io/docs/markdown-features/code-blocks)
- [Docusaurus Deployment (GitHub Pages)](https://docusaurus.io/docs/deployment)
- [@easyops-cn/docusaurus-search-local](https://github.com/easyops-cn/docusaurus-search-local)
- [research.md](./research.md)
- [data-model.md](./data-model.md)
