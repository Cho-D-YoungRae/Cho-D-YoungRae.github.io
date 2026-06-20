# Docusaurus → AstroPaper v6 마이그레이션 설계

- **작성일**: 2026-06-20
- **상태**: 설계 합의 완료 (구현 미착수)
- **대상 저장소**: `Cho-D-YoungRae.github.io` (심플스택 기술 블로그)

---

## 1. 배경 & 목표

현재 블로그는 **Docusaurus 3.9.2** 기반이며 `docs: false`, `routeBasePath: '/'`로 **순수 블로그**로만 운영 중이다. 즉 Docusaurus의 핵심 가치인 "문서 사이트" 기능을 쓰지 않고 부가 기능인 블로그만 사용하는 미스매치가 있다.

**현재 상태의 마이그레이션 친화성:**
- 게시글이 2개뿐 (`2026-02-15-hello-world`, `2026-02-16-second-post`) → 지금이 스택 전환 비용이 가장 낮은 시점
- 커스터마이징이 거의 없음 (스위즐 1개 + 거의 기본값인 `custom.css`) → 종속성이 얕아 이전이 쉬움

**목표:** TypeScript/React 배경을 살리면서 디자인 자유도·글쓰기 경험·성능·유지보수의 균형이 좋은 스택으로 전환한다.

---

## 2. 검토한 대안 (의사결정 기록)

기술 블로그에 현실적인 SSG를 4가지 우선순위 축(글쓰기 / 디자인 자유도 / 단순함·유지보수 / 성능·생태계·커리어)으로 비교했다.

| 후보 | 글쓰기 | 디자인 자유도 | 단순함·유지보수 | 성능·커리어 | 판정 |
|---|:---:|:---:|:---:|:---:|---|
| **Astro** | ◎ | ◎ | ○ | ◎ | **채택** |
| Hugo | ○ | ○ | ◎ | ○ | 차순위 (Go 템플릿 학습, React 배경 단절) |
| Docusaurus (현행) | ○ | △ | △ | ○ | 문서 도구를 블로그로 쓰는 미스매치 |
| Jekyll | ○ | ○ | △\* | △ | Ruby 무경험 마찰로 제외 |
| Eleventy | ○ | ◎ | ○ | ○ | 전부 직접 조립 필요 |
| Next.js 직접 구축 | △ | ◎ | ✕ | ◎ | 블로그엔 오버엔지니어링 |
| Gatsby | — | — | — | — | **제외** (2023.8 팀 해체, 유지보수 모드) |

\* Jekyll의 단순함은 Ruby 환경이 손에 익었을 때 한정. 사용자는 Ruby 무경험.

**Astro 채택 근거:** Markdown/MDX + Content Collections(타입세이프 frontmatter), React 컴포넌트 재사용 가능(배경 활용), 기본 제로 JS로 최고 수준 Core Web Vitals, 2024~2026 콘텐츠 프레임워크의 사실상 표준(커리어 가치).

**테마: AstroPaper v6 채택.** 가장 검증된 미니멀 블로그 테마(4,200+ stars), 2026-05-17 Astro 6 + Tailwind 4 기반 전면 재작성으로 최신·활발. 다크모드·태그·아카이브·**Pagefind 검색(한국어 우수)**·RSS·SEO·OG 자동생성·i18n ready·타입세이프 frontmatter 내장. 한국어 사용 사례가 풍부.

---

## 3. 타겟 아키텍처

- **스택**: Astro 6 + Tailwind 4 + TypeScript + Content Collections + Pagefind(검색) + astro-expressive-code(코드블록)
- **디렉토리 구조 변화**:

| 현재 (Docusaurus) | 이전 후 (AstroPaper v6) | 비고 |
|---|---|---|
| `blog/*.md` | `src/content/posts/*.md` | 글 위치 이동 |
| `docusaurus.config.ts` | `astro.config.ts` + `astro-paper.config.ts` | 빌드 설정과 사이트 설정 분리 |
| `src/css/custom.css` | `src/styles/*` | 컬러 변수를 Tailwind 토큰으로 |
| `src/theme/BlogPostPage/Metadata` (스위즐) | **불필요** | OG/트위터 카드 기본 내장 |
| `static/img/simplestack-logo.png` | `public/` | 로고·파비콘 |

---

## 4. 콘텐츠 마이그레이션 (글 2개)

### 4.1 frontmatter 매핑 (AstroPaper v6 실제 zod 스키마 기준)

AstroPaper v6 posts 컬렉션 필수 필드: `title`, `pubDatetime`, `description`. 선택 필드: `author`(기본=config), `modDatetime`, `tags`(기본 `["others"]`), `featured`, `draft`, `ogImage`, `canonicalURL`, `hideEditPost`, `timezone`.

| Docusaurus | AstroPaper v6 | 처리 |
|---|---|---|
| `title` | `title` (필수) | 그대로 |
| `date: 2026-02-15` | `pubDatetime: 2026-02-15T09:00:00+09:00` | 날짜 → 일시. **KST(+09:00) 명시**로 날짜가 하루 밀리는 문제 방지 |
| `description` | `description` (필수) | 그대로 — 양쪽 다 필수라 안전 |
| `tags: [a, b]` | `tags: [a, b]` | 그대로 |
| `<!-- truncate -->` | **제거** | 목록 요약은 `description`이 담당 |

### 4.2 코드 블록 (결정: astro-expressive-code 도입)

현재 글은 Docusaurus 전용 메타 문법을 사용한다:

```
```javascript {1,4-6} showLineNumbers title="example.js"
```

**`astro-expressive-code`를 도입하면 이 메타 문법을 거의 그대로 유지할 수 있다.** Docusaurus와의 매핑:

| Docusaurus 메타 | expressive-code | 비고 |
|---|---|---|
| `{1,4-6}` (라인 하이라이트) | `{1,4-6}` | **동일** |
| `title="example.js"` | `title="example.js"` | **동일** (또는 코드 첫 줄 파일명 주석으로 자동 감지) |
| `showLineNumbers` (줄번호) | `showLineNumbers` | **`@expressive-code/plugin-line-numbers` 플러그인 추가 필요** |

**통합 방법:**
- `astro.config`의 integrations에 `astro-expressive-code` 추가 (Astro 기본 Shiki 코드블록을 대체)
- 줄번호는 `@expressive-code/plugin-line-numbers`를 별도 설치 후 등록 (전역 기본값 on/off 설정 가능)
- **다크모드 연동**: expressive-code 듀얼 테마 + `themeCssSelector`를 AstroPaper 테마 토글(`data-theme`)에 맞춰 코드블록도 함께 전환
- **AstroPaper 통합 조정**: 테마 기본 코드블록(복사 버튼·Shiki 설정)과 중복되지 않도록 코드블록 처리를 expressive-code로 일원화

**결과**: 기존 2개 글의 코드블록 메타를 거의 수정 없이 유지. 트레이드오프 = 추가 의존성(integration + 줄번호 플러그인)과 AstroPaper 통합 조정 작업.

> 구현 단계에서 [expressive-code 공식 문서](https://expressive-code.com)로 Astro 6 기준 최신 설정·플러그인 버전을 확정한다.

---

## 5. 기능 대응표

| 기능 | 현재 (Docusaurus) | AstroPaper v6 |
|---|---|---|
| 검색 | `@cmfcmf/docusaurus-search-local` | **Pagefind 내장** (한국어 CJK 우수) |
| 태그 | `/tags` | 페이지 내장 |
| 아카이브 | `/archive` | Archives 페이지 내장 |
| RSS | `feedOptions` | 내장 |
| 다크/라이트 모드 | `respectPrefersColorScheme` | 토글 내장 |
| 트위터·OG 카드 | **스위즐 필요** | **OG 자동생성 + 카드 내장 → 스위즐 제거** |
| 한국어 | `i18n: ko` | i18n ready (`LOCALE=ko-KR` + UI 텍스트 일부 한글화 필요) |
| 코드 하이라이트 | Prism (github / dracula) | **astro-expressive-code** (Shiki 기반, 메타 문법 보존 + 복사 버튼·듀얼 테마) |
| 로고·파비콘 | `static/img/simplestack-logo.png` | `public/`로 이동 후 설정 |
| 네비·소셜 | GitHub, Email 링크 | config의 소셜 링크 설정 |

---

## 6. 사이트 설정 (`astro-paper.config.ts`)

한 파일에서 관리:
- 사이트 제목: `심플스택`, 태그라인/설명
- 사이트 URL: `https://cho-d-youngrae.github.io`
- author, 소셜 링크 (GitHub: `Cho-D-YoungRae`, Email)
- `LOCALE = ko-KR`, 타임존 `Asia/Seoul`
- 페이지당 글 수 등

---

## 7. 댓글 (결정: 지금 함께 추가 — Giscus)

GitHub Discussions 기반 Giscus를 이번 마이그레이션에 포함한다.

**필요한 GitHub 수동 단계:**
1. 저장소 Settings → **Discussions 기능 활성화**
2. [giscus.app](https://giscus.app) 에서 저장소 입력 → Discussion 카테고리 선택(예: `General` 또는 전용 `Comments` 카테고리) → 매핑 방식 `pathname` → 생성된 설정값(repo id, category id) 확보
3. AstroPaper 글 레이아웃에 Giscus 컴포넌트/스크립트 추가 + 설정값 입력
4. **다크모드 연동**: 테마 토글 시 giscus 테마(`light`/`dark`)도 동기화되도록 연결

> 참고: AstroPaper v6에 Giscus가 기본 내장이 아니면 글 상세 레이아웃에 직접 통합한다.

---

## 8. 배포 & URL

- **GitHub Actions**: 현재 패턴 유지 (Node 24 → 의존성 설치 → `astro build` → Pages 업로드). **Pagefind 인덱스 생성(postbuild)이 빌드 파이프라인에 포함되는지 확인** 필요.
- **base**: `/` (User Pages `cho-d-youngrae.github.io`라 루트 그대로). Astro config의 `site` 설정.
- **URL 변화**: `/2026/02/15/hello-world` → `/posts/hello-world`. 글 2개·신규라 SEO 영향 미미. 기존 URL 보존이 필요하면 리다이렉트 설정 가능하나 현 단계에선 불필요.

---

## 9. 안전한 전환 순서 (롤백 가능)

1. 새 브랜치에서 AstroPaper v6 스캐폴드 + 의존성 설치
2. `astro-paper.config.ts`에 사이트 설정 입력
3. astro-expressive-code 통합 (integration + `@expressive-code/plugin-line-numbers` + 다크모드 연동)
4. 글 2개 이전 (frontmatter 매핑 + 코드블록 메타는 거의 그대로 유지)
5. 로고·파비콘·소셜 링크·한국어 UI 텍스트 조정
6. Giscus 통합 (GitHub Discussions 활성화 + 설정값 연결 + 다크모드 동기화)
7. 로컬 `astro build` + preview로 시각·기능 확인 (검색·태그·아카이브·다크모드·RSS·댓글·코드블록)
8. GitHub Actions 워크플로 교체
9. 검증 후 main 병합 → 배포

> **롤백**: 기존 Docusaurus 코드는 git 히스토리에 그대로 보존된다. 문제 발생 시 워크플로(또는 브랜치)만 되돌리면 복구된다.

---

## 10. 후속 / 미해결 항목

- **검색 확장성**: Pagefind라 글이 수백 개로 늘어도 안정적 — 추가 조치 불필요.
- **한국어 UI 텍스트**: AstroPaper 기본 UI 문자열("Search", "Tags" 등)의 한글화 범위는 구현 단계에서 확정.

---

## 11. 결정 로그 요약

| 항목 | 결정 | 비고 |
|---|---|---|
| 스택 | Astro | Hugo가 차순위 |
| 테마 | AstroPaper v6 | Astro Micro가 대안 |
| 코드블록 | **astro-expressive-code 도입** | Docusaurus 메타 문법 보존(줄번호는 플러그인 추가) |
| 댓글 | Giscus 지금 추가 | GitHub Discussions 수동 설정 필요 |
| URL | AstroPaper 기본(`/posts/slug`) | 리다이렉트 불필요 |
| 진행 범위 | **설계 확인까지** | 구현 계획·실제 작업은 미진행 |
