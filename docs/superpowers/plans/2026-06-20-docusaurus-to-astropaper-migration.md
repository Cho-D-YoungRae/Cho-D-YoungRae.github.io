# Docusaurus → AstroPaper v6 마이그레이션 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 현재 Docusaurus 블로그를 AstroPaper v6 기반으로 이전하고, expressive-code 코드블록·Giscus 댓글·한국어 설정을 적용해 GitHub Pages로 배포한다.

**Architecture:** 새 작업 브랜치에서 Docusaurus 자산을 AstroPaper v6 템플릿으로 교체한 뒤, 사이트 설정·콘텐츠·통합(expressive-code, Giscus)을 순차 커스터마이징한다. 각 단계는 독립적으로 빌드 검증·커밋하며, 기존 Docusaurus는 git 히스토리에 보존되어 롤백 가능하다.

**Tech Stack:** Astro ^6.4.2, AstroPaper v6, Tailwind 4, TypeScript, Pagefind(검색·내장), astro-expressive-code(코드블록), Giscus(댓글), GitHub Actions + Pages.

## 검증 방식 (이 프로젝트 특수사항)

이 프로젝트는 **정적 사이트**라 단위 테스트(TDD)가 자연스럽지 않다. 각 Task의 검증은 다음으로 대체한다 (전역 규칙 "작업 후 항상 테스트·타입체크"와 일치):
- **`npm run build`** — 내부에서 `astro check`(타입·콘텐츠 스키마 검증)를 먼저 돌리므로, frontmatter 스키마 오류·타입 오류·깨진 링크를 빌드 시점에 잡는다.
- **`npm run preview`** — 로컬에서 실제 렌더 결과를 눈으로 확인한다 (기능별 체크리스트는 Task 9).

## Global Constraints

- **Astro**: `^6.4.2` / **Node**: `>=22.12.0` (CI·로컬 모두 Node 24 사용 — 기존 워크플로 유지)
- **패키지 매니저**: npm (`package-lock.json` 사용)
- **사이트 URL**: `https://cho-d-youngrae.github.io`, **base**: `/` (User Pages)
- **언어**: `lang: "ko"`, **타임존**: `Asia/Seoul`
- **빌드 출력 디렉토리**: `dist/` (Docusaurus의 `build/`가 아님 — 워크플로 경로 주의)
- **글 위치**: `src/content/posts/`, **필수 frontmatter**: `title`, `pubDatetime`, `description`
- **작업 브랜치**: `feat/migrate-to-astropaper` (main 직접 작업 금지)

---

## File Structure

| 파일/디렉토리 | 책임 | Task |
|---|---|---|
| `astro.config.ts` | Astro 빌드 설정, expressive-code integration (기존 Shiki transformers 대체) | 1, 3 |
| `astro-paper.config.ts` | 사이트 설정(제목·URL·author·소셜·언어·타임존) | 2 |
| `src/content/posts/2026-02-15-hello-world.md` | 이전된 글 1 | 4 |
| `src/content/posts/2026-02-16-second-post.md` | 이전된 글 2 | 4 |
| `src/content.config.ts` | 콘텐츠 컬렉션 스키마 (AstroPaper 제공, 수정 없음) | 1 |
| `package.json` | 의존성·스크립트 (AstroPaper 것으로 교체 + expressive-code 추가) | 1, 3 |
| `public/` | 로고·파비콘 등 정적 자산 | 5 |
| `src/components/Giscus.astro` | Giscus 댓글 컴포넌트 (신규) | 7 |
| `src/layouts/PostDetails.astro` | 글 상세 레이아웃 (Giscus 삽입점) | 7 |
| `src/i18n/` 또는 UI 문자열 | 한국어 UI 텍스트 | 6 |
| `.github/workflows/deploy.yml` | 배포 워크플로 (`path: build` → `dist`) | 8 |
| `.github/workflows/test-deploy.yml` | PR 빌드 검증 (변경 거의 없음) | 8 |

> **보존 대상(절대 삭제 금지)**: `.git`, `.github/`(Task 8에서 수정), `docs/`(설계·계획 문서), `CLAUDE.md`, `README.md`, `blog/`(Task 4 변환 소스 — Task 4에서 제거).

---

## Task 1: 작업 브랜치 생성 및 AstroPaper v6 템플릿 도입

**Files:**
- Create: AstroPaper v6 전체 (`astro.config.ts`, `src/`, `public/`, `package.json`, `tsconfig.json` 등)
- Delete: `docusaurus.config.ts`, `src/`(기존), `static/`, `.docusaurus/`, `build/`, 기존 `package.json`·`package-lock.json`·`tsconfig.json`

**Produces:** AstroPaper 기본 사이트가 빌드되는 상태. 이후 모든 Task의 토대.

- [ ] **Step 1: 작업 브랜치 생성**

```bash
git checkout -b feat/migrate-to-astropaper
```

- [ ] **Step 2: AstroPaper v6를 임시 디렉토리로 가져오기**

```bash
npx degit satnaing/astro-paper .astropaper-tmp
```
Expected: `.astropaper-tmp/`에 AstroPaper 소스가 받아짐 (`.git` 없음).

- [ ] **Step 3: Docusaurus 전용 자산 제거**

```bash
git rm -r src static docusaurus.config.ts tsconfig.json package.json package-lock.json
rm -rf .docusaurus build
```
Expected: 위 항목이 staged 삭제됨. `blog/`·`docs/`·`.github/`·`CLAUDE.md`·`README.md`는 남아 있어야 함.

- [ ] **Step 4: AstroPaper 자산을 레포 루트로 복사**

```bash
cp -rf .astropaper-tmp/. .
rm -rf .astropaper-tmp
```
Expected: `astro.config.ts`, `astro-paper.config.ts`, `src/`, `public/`, `package.json` 등이 레포 루트에 생김.

- [ ] **Step 5: `.gitignore` 병합 확인**

AstroPaper의 `.gitignore`가 기존 것을 덮어썼다. `dist/`, `node_modules/`, `public/pagefind/`(빌드 산출 복사본), `.astro/`가 무시 대상에 포함됐는지 확인하고, 빠진 항목은 추가한다.

- [ ] **Step 6: 의존성 설치**

```bash
npm install
```
Expected: `node_modules/` 생성, `package-lock.json` 갱신, 오류 없음.

- [ ] **Step 7: 기본 빌드 검증**

```bash
npm run build
```
Expected: `astro check` 통과 → `astro build`로 `dist/` 생성 → `pagefind --site dist` 인덱싱까지 성공 (AstroPaper 샘플 글 기준).

- [ ] **Step 8: 커밋**

```bash
git add -A
git commit -m "chore: AstroPaper v6 템플릿 도입 및 Docusaurus 제거"
```

---

## Task 2: 사이트 설정 (astro-paper.config.ts)

**Files:**
- Modify: `astro-paper.config.ts`

**Consumes:** Task 1의 AstroPaper 설정 구조(`defineAstroPaperConfig`).
**Produces:** 심플스택 사이트 정보가 반영된 설정. 메타·OG·소셜·언어의 기준.

- [ ] **Step 1: site 객체를 심플스택 값으로 변경**

`astro-paper.config.ts`의 `site` 객체 필드를 아래 값으로 교체한다:

```ts
site: {
  url: "https://cho-d-youngrae.github.io",
  title: "심플스택",
  description: "Cho-D-YoungRae의 기술 블로그",
  author: "Cho-D-YoungRae",
  profile: "https://github.com/Cho-D-YoungRae",
  ogImage: "default-og.jpg", // Task 5에서 로고 기반으로 교체 가능
  lang: "ko",
  timezone: "Asia/Seoul",
  dir: "ltr",
},
```

- [ ] **Step 2: posts 페이지네이션 조정**

```ts
posts: {
  perPage: 10,   // 기존 Docusaurus postsPerPage(50)보다 합리적인 기본값
  perIndex: 5,
  scheduledPostMargin: 15,
},
```

- [ ] **Step 3: 소셜 링크를 GitHub·Email로 설정**

`socials` 배열을 아래로 교체한다 (AstroPaper의 social 항목 구조 = `{ name, href, linkTitle, icon }`; `icon`은 템플릿이 제공하는 아이콘 키를 그대로 사용):

```ts
socials: [
  {
    name: "Github",
    href: "https://github.com/Cho-D-YoungRae",
    linkTitle: "Cho-D-YoungRae on GitHub",
    icon: "IconGitHub",
  },
  {
    name: "Mail",
    href: "mailto:yrc9229@gmail.com",
    linkTitle: "Send an email to Cho-D-YoungRae",
    icon: "IconMail",
  },
],
```
> `icon` 키 이름은 템플릿의 기존 `socials` 예시에서 쓰는 값을 그대로 따른다(파일 상단 import 또는 기존 항목 참고).

- [ ] **Step 4: 빌드 검증**

```bash
npm run build
```
Expected: 빌드 성공. `astro check` 통과.

- [ ] **Step 5: 시각 확인**

```bash
npm run preview
```
Expected: 브라우저에서 사이트 제목 "심플스택", 푸터/소셜에 GitHub·Email 링크 표시.

- [ ] **Step 6: 커밋**

```bash
git add astro-paper.config.ts
git commit -m "feat: 사이트 설정을 심플스택으로 구성"
```

---

## Task 3: astro-expressive-code 통합 (기존 Shiki transformers 대체)

**Files:**
- Modify: `astro.config.ts`, `package.json`

**Consumes:** Task 1의 `astro.config.ts`(현재 `markdown.shikiConfig`에 `@shikijs/transformers` 사용).
**Produces:** 코드블록을 expressive-code가 렌더(메타 문법 `{1,4-6}`·`title=`·`showLineNumbers` 지원). Task 4의 글 코드블록이 이 설정에 의존.

- [ ] **Step 1: expressive-code 패키지 설치**

```bash
npm install astro-expressive-code @expressive-code/plugin-line-numbers
```
Expected: 두 패키지가 `dependencies`에 추가됨.

- [ ] **Step 2: astro.config.ts에 expressive-code integration 추가 + 기존 Shiki transformers 제거**

`astro.config.ts`를 아래와 같이 수정한다. 핵심: ① `expressiveCode()`를 integrations **맨 앞**에 추가(MDX보다 먼저), ② 기존 `markdown.shikiConfig`의 `transformers`(fileName·notationHighlight 등)를 제거(expressive-code와 중복·충돌 방지), ③ 다크모드 셀렉터를 AstroPaper 테마 토글에 맞춤.

```ts
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import expressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import config from "./astro-paper.config";

export default defineConfig({
  site: config.site.url,
  integrations: [
    expressiveCode({
      themes: ["min-light", "night-owl"], // 기존 AstroPaper Shiki 테마와 동일하게 유지
      plugins: [pluginLineNumbers()],
      defaultProps: { showLineNumbers: false }, // 글에서 showLineNumbers 명시한 블록만 표시
      themeCssSelector: theme => `[data-theme="${theme.type}"]`, // AstroPaper 다크모드(data-theme) 연동
      styleOverrides: { borderRadius: "0.4rem" },
    }),
    mdx(),
    sitemap({
      filter: page => !page.endsWith("/archives/"), // 기존 sitemap 필터 유지
    }),
  ],
  markdown: {
    // remark/rehype 플러그인은 유지, shikiConfig.transformers 는 제거
    remarkPlugins: [/* 기존 remark-toc, remark-collapse 유지 */],
    rehypePlugins: [/* 기존 rehype-callouts 유지 */],
  },
});
```
> 기존 `astro.config.ts`의 remark/rehype 플러그인 import와 sitemap filter는 **그대로 보존**하고, `shikiConfig` 블록만 제거한다. (정확한 기존 내용은 Task 1으로 받은 파일 기준)

- [ ] **Step 3: 다크모드 셀렉터 확인**

AstroPaper v6가 다크모드를 `<html data-theme="dark">`로 토글하는지 확인한다(테마 토글 버튼 코드 또는 `<html>` 속성). 셀렉터가 다르면(예: `.dark`) `themeCssSelector`를 그에 맞춰 수정한다.

- [ ] **Step 4: 임시 코드블록으로 렌더 검증**

AstroPaper 샘플 글 하나에 아래 블록을 임시 추가한다:

````md
```js {2} showLineNumbers title="demo.js"
const a = 1;
const b = 2; // 강조 + 줄번호 + 파일명 라벨
```
````

- [ ] **Step 5: 빌드 + 시각 검증**

```bash
npm run build && npm run preview
```
Expected: 코드블록에 파일명 라벨("demo.js"), 2번째 줄 강조, 줄번호가 표시됨. 라이트/다크 모드 토글 시 코드 테마도 함께 전환됨. 확인 후 임시 블록 제거.

- [ ] **Step 6: 커밋**

```bash
git add astro.config.ts package.json package-lock.json
git commit -m "feat: astro-expressive-code 도입 및 기본 Shiki transformers 대체"
```

---

## Task 4: 글 2개 마이그레이션

**Files:**
- Create: `src/content/posts/2026-02-15-hello-world.md`, `src/content/posts/2026-02-16-second-post.md`
- Delete: `blog/`(전체), AstroPaper 샘플 글(`src/content/posts/` 내 기본 데모 글)

**Consumes:** Task 3의 expressive-code(코드블록 메타), `src/content.config.ts`의 zod 스키마(`title`·`pubDatetime`·`description` 필수).
**Produces:** 실제 블로그 글 2개가 빌드되는 상태.

- [ ] **Step 1: AstroPaper 샘플 글 제거**

```bash
rm -f src/content/posts/*.md src/content/posts/*.mdx
```
> AstroPaper가 글을 하위 폴더로 둔 경우 해당 폴더의 데모 글도 제거. 단 `_` 로 시작하는 설정/스키마 파일은 보존.

- [ ] **Step 2: 글 1 작성 — `src/content/posts/2026-02-15-hello-world.md`**

frontmatter를 AstroPaper 스키마로 변환한다 (`date`→`pubDatetime` KST 명시, `<!-- truncate -->` 제거, 코드블록 메타는 expressive-code가 처리하므로 **그대로 유지**):

````md
---
title: "심플스택 블로그를 시작합니다"
pubDatetime: 2026-02-15T09:00:00+09:00
description: "심플스택 기술 블로그의 첫 번째 게시글입니다. 블로그를 시작하게 된 배경과 앞으로의 방향을 소개합니다."
tags: [blog, introduction]
---

심플스택 기술 블로그를 시작합니다.

이 블로그에서는 소프트웨어 개발과 관련된 다양한 기술 주제를 다룰 예정입니다.

## 블로그 소개

심플스택은 개발 과정에서 배운 것들을 기록하고 공유하기 위한 기술 블로그입니다.

### 다루게 될 주제

- 프로그래밍 언어 및 프레임워크
- 소프트웨어 아키텍처
- 개발 도구 및 환경 설정
- 문제 해결 과정

## 코드 블록 예시

JavaScript 함수 예시입니다:

```javascript {1,4-6} showLineNumbers title="example.js"
import React from 'react';

function Greeting(props) {
  if (props.name) {
    return <h1>Hello, {props.name}!</h1>;
  }
  return <h1>Hello, World!</h1>;
}

export default Greeting;
```

Python 예시:

```python showLineNumbers title="hello.py"
def greet(name: str) -> str:
    """인사 메시지를 반환합니다."""
    return f"안녕하세요, {name}님!"

if __name__ == "__main__":
    print(greet("심플스택"))
```

인라인 코드는 `console.log("Hello")` 처럼 사용합니다.

## 마무리

앞으로 꾸준히 글을 작성해 나가겠습니다.
````

- [ ] **Step 3: 글 2 작성 — `src/content/posts/2026-02-16-second-post.md`**

````md
---
title: "Docusaurus로 기술 블로그 만들기"
pubDatetime: 2026-02-16T09:00:00+09:00
description: "Docusaurus를 사용하여 GitHub Pages에 기술 블로그를 구축하는 과정을 정리합니다."
tags: [docusaurus, tutorial]
---

Docusaurus를 사용하여 기술 블로그를 구축하는 과정을 공유합니다.

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
````
> 참고: 이 글은 내용상 Docusaurus를 다루므로, 이전 후 콘텐츠 갱신을 별도로 고려할 수 있다(마이그레이션 범위 밖).

- [ ] **Step 4: 빌드 검증 (스키마 통과 확인)**

```bash
npm run build
```
Expected: `astro check`가 두 글의 frontmatter를 zod 스키마로 검증 통과. 빌드 성공.

- [ ] **Step 5: 시각 확인**

```bash
npm run preview
```
Expected: 글 목록에 2개 글, 각 글의 코드블록에 라인 하이라이트·줄번호·파일명 라벨 정상 표시. 날짜가 2026-02-15/16로(하루 밀림 없이) 표시.

- [ ] **Step 6: 기존 blog/ 제거 및 커밋**

```bash
git rm -r blog
git add -A
git commit -m "feat: 기존 글 2개를 AstroPaper 콘텐츠로 이전"
```

---

## Task 5: 로고·파비콘 등 정적 자산

**Files:**
- Create: `public/simplestack-logo.png` (기존 `static/img/`에서 이동 — Task 1에서 `static/`을 지웠으므로 git 히스토리에서 복원)
- Modify: 파비콘/OG 참조 설정

**Produces:** 브랜드 로고·파비콘이 적용된 사이트.

- [ ] **Step 1: 기존 로고를 git 히스토리에서 복원해 public/로 배치**

```bash
git show HEAD~5:static/img/simplestack-logo.png > public/simplestack-logo.png
```
> `HEAD~5`는 예시. `git log --all --oneline -- static/img/simplestack-logo.png`로 로고가 존재하던 커밋을 찾아 그 해시를 사용한다.

- [ ] **Step 2: 파비콘 설정**

AstroPaper의 파비콘 위치(`public/favicon.svg` 또는 `public/toggle-theme.js` 인근 head 설정)를 확인하고, 로고 기반 파비콘으로 교체한다. PNG를 파비콘으로 쓰려면 `public/favicon.png`로 두고 head의 favicon 링크를 맞춘다.

- [ ] **Step 3: 빌드 + 확인**

```bash
npm run build && npm run preview
```
Expected: 네비바 로고/탭 파비콘이 심플스택 로고로 표시.

- [ ] **Step 4: 커밋**

```bash
git add public/
git commit -m "feat: 심플스택 로고·파비콘 적용"
```

---

## Task 6: 한국어 UI 텍스트

**Files:**
- Modify: AstroPaper UI 문자열 위치 (`src/i18n/`, `src/constants.ts`, 또는 각 컴포넌트의 텍스트)

**Produces:** UI 표면 문자열이 한국어로 표시되는 사이트.

- [ ] **Step 1: UI 문자열 소스 파악**

AstroPaper v6에서 "Search", "Tags", "Archives", "Recent Posts", "Back to Top" 등의 문자열이 정의된 위치를 찾는다 (전역 i18n 파일이 있으면 그 파일, 없으면 각 컴포넌트). `lang: "ko"`는 Task 2에서 이미 설정됨(`<html lang="ko">` 반영).

```bash
grep -rn "Recent Posts\|Search\|Archives\|Back to Top" src/
```

- [ ] **Step 2: 핵심 UI 문자열 한글화**

찾은 위치의 문자열을 번역한다. 예: `Search`→`검색`, `Tags`→`태그`, `Archives`→`아카이브`, `Recent Posts`→`최근 글`, `All Posts`→`전체 글`, `Back to Top`→`맨 위로`.

- [ ] **Step 3: 빌드 + 확인**

```bash
npm run build && npm run preview
```
Expected: 네비·검색·태그·아카이브·푸터 UI가 한국어로 표시. `<html lang="ko">` 확인.

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "feat: UI 텍스트 한국어화"
```

---

## Task 7: Giscus 댓글 통합

**Files:**
- Create: `src/components/Giscus.astro`
- Modify: `src/layouts/PostDetails.astro` (글 상세 레이아웃)

**전제(사용자 수동 단계):**
1. GitHub 저장소 Settings → Discussions 기능 활성화
2. [giscus.app](https://giscus.app)에서 저장소 입력 → 카테고리 선택(예: `Comments` 카테고리 생성) → 매핑 `pathname` → 발급된 `data-repo-id`, `data-category-id` 확보

**Produces:** 글 하단에 다크모드 연동 Giscus 댓글이 표시.

- [ ] **Step 1: Giscus 컴포넌트 생성 — `src/components/Giscus.astro`**

`<REPO_ID>`, `<CATEGORY_ID>`는 giscus.app에서 발급받은 실제 값으로 교체한다.

```astro
---
// src/components/Giscus.astro
---
<section id="giscus" class="mx-auto mt-12 w-full"></section>
<script
  src="https://giscus.app/client.js"
  data-repo="Cho-D-YoungRae/Cho-D-YoungRae.github.io"
  data-repo-id="<REPO_ID>"
  data-category="Comments"
  data-category-id="<CATEGORY_ID>"
  data-mapping="pathname"
  data-strict="0"
  data-reactions-enabled="1"
  data-emit-metadata="0"
  data-input-position="bottom"
  data-theme="preferred_color_scheme"
  data-lang="ko"
  crossorigin="anonymous"
  async
  is:inline></script>

<script is:inline>
  // AstroPaper 다크모드 토글과 giscus 테마 동기화
  function setGiscusTheme() {
    const theme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const iframe = document.querySelector("iframe.giscus-frame");
    iframe?.contentWindow?.postMessage(
      { giscus: { setConfig: { theme } } },
      "https://giscus.app"
    );
  }
  const observer = new MutationObserver(setGiscusTheme);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
</script>
```
> `data-theme` 속성명은 Task 3 Step 3에서 확인한 AstroPaper 다크모드 셀렉터와 일치시킨다.

- [ ] **Step 2: 글 상세 레이아웃에 Giscus 삽입**

`src/layouts/PostDetails.astro`(글 본문을 렌더하는 레이아웃)에서 본문·태그 아래, 이전/다음 글 네비 근처에 컴포넌트를 추가한다:

```astro
---
import Giscus from "@/components/Giscus.astro";
// ...기존 import
---
<!-- ...기존 본문/태그 렌더링... -->
<Giscus />
```
> import 별칭(`@/`)은 AstroPaper의 `tsconfig.json` paths 설정을 따른다. 별칭이 다르면 상대경로로 조정.

- [ ] **Step 3: 빌드 + 확인**

```bash
npm run build && npm run preview
```
Expected: 글 상세 페이지 하단에 Giscus 댓글 위젯 로드. 다크모드 토글 시 위젯 테마도 전환. (로컬에서 위젯이 안 뜨면 giscus.app 설정값/Discussions 활성화 재확인)

- [ ] **Step 4: 커밋**

```bash
git add src/components/Giscus.astro src/layouts/PostDetails.astro
git commit -m "feat: Giscus 댓글 통합 및 다크모드 연동"
```

---

## Task 8: 배포 워크플로 수정

**Files:**
- Modify: `.github/workflows/deploy.yml`, `.github/workflows/test-deploy.yml`

**Consumes:** AstroPaper의 `npm run build`(내부에 `astro build` + `pagefind` 포함), 출력 `dist/`.
**Produces:** main push 시 Astro 사이트가 GitHub Pages로 배포.

- [ ] **Step 1: deploy.yml의 업로드 경로 수정**

`deploy.yml`의 `upload-pages-artifact` 단계에서 `path: build`를 `path: dist`로 변경한다 (Astro 출력 디렉토리). 나머지(Node 24, `npm ci`, `npm run build`, deploy-pages)는 그대로 유지.

```yaml
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist
```

- [ ] **Step 2: test-deploy.yml 확인**

`test-deploy.yml`은 PR 시 `npm run build`만 수행하므로 수정 불필요(이미 `astro check`+빌드+pagefind를 검증). 변경 없음을 확인만 한다.

- [ ] **Step 3: 로컬에서 빌드 산출물 경로 확인**

```bash
npm run build && ls dist/index.html
```
Expected: `dist/index.html` 존재(빌드 출력이 `dist/`임을 확인).

- [ ] **Step 4: 커밋**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: 배포 워크플로를 Astro(dist) 출력에 맞게 수정"
```

---

## Task 9: 최종 검증 및 main 병합

**Files:** 없음 (검증·병합)

**Produces:** 검증 완료된 마이그레이션이 main에 반영.

- [ ] **Step 1: 전체 타입·빌드 검증**

```bash
npm run build
```
Expected: `astro check` 0 errors, 빌드 성공, pagefind 인덱싱 성공.

- [ ] **Step 2: 기능 체크리스트 (preview)**

```bash
npm run preview
```
다음을 모두 확인:
- [ ] 글 목록·상세 렌더링 (2개 글)
- [ ] 코드블록: 라인 하이라이트·줄번호·파일명 라벨 (expressive-code)
- [ ] 검색 (Pagefind) 동작 — 한국어 검색어
- [ ] 태그 페이지 / 아카이브 페이지
- [ ] 다크/라이트 토글 (코드블록·Giscus 테마 동기화 포함)
- [ ] RSS 피드(`/rss.xml`) 생성
- [ ] Giscus 댓글 로드
- [ ] UI 한국어 표시, `<html lang="ko">`
- [ ] 로고·파비콘

- [ ] **Step 3: main 병합**

```bash
git checkout main
git merge --no-ff feat/migrate-to-astropaper -m "feat: Docusaurus에서 AstroPaper v6로 마이그레이션"
```
> push는 사용자 확인 후 진행 (`git push origin main`). push 시 GitHub Actions가 실제 배포한다.

- [ ] **Step 4: CLAUDE.md 갱신 (마이그레이션 반영)**

`CLAUDE.md`의 기술 스택·구조·명령어 섹션을 AstroPaper 기준으로 갱신한다 (Docusaurus → Astro, `blog/` → `src/content/posts/`, 명령어 `npm run dev/build/preview`). 별도 커밋: `docs: CLAUDE.md를 AstroPaper 기준으로 갱신`.

---

## Self-Review

**Spec coverage (설계 문서 대비):**
- §3 타겟 아키텍처(스택·디렉토리) → Task 1 ✓
- §4.1 frontmatter 매핑 → Task 4 Step 2-3 ✓
- §4.2 expressive-code 도입 → Task 3 ✓
- §5 기능 대응표(검색·태그·아카이브·RSS·다크모드·OG·한국어·코드) → Task 1(Pagefind 내장)·6·9 ✓
- §6 사이트 설정 → Task 2 ✓
- §7 Giscus → Task 7 ✓
- §8 배포·URL → Task 8 ✓
- §9 전환 순서 → Task 1-9 순서 일치 ✓

**알려진 의존성/주의:**
- AstroPaper 다크모드 셀렉터(`data-theme` 가정)는 Task 3 Step 3에서 실제 확인 후 Task 7에 반영 — 두 곳의 셀렉터가 일치해야 함.
- `src/layouts/PostDetails.astro` 파일명은 AstroPaper v6 실제 구조에서 글 상세 레이아웃을 확인해 정확히 지정(Task 7).
- Giscus `data-repo-id`/`data-category-id`는 외부(giscus.app) 발급값 — 사용자 수동 단계.

---

## Execution Handoff

이 계획은 `docs/superpowers/plans/2026-06-20-docusaurus-to-astropaper-migration.md`에 저장되었다. 실행은 두 가지 방식이 있다:

1. **Subagent-Driven (권장)** — Task마다 새 서브에이전트 디스패치, Task 사이 리뷰, 빠른 반복.
2. **Inline Execution** — 현재 세션에서 executing-plans로 체크포인트마다 확인하며 일괄 실행.
