# 심플스택 (Cho-D-YoungRae.github.io)

AstroPaper v6 기반 한국어 기술 블로그 (`lang: ko`)

## 기술 스택

- Node.js 24, TypeScript, Astro 6, Tailwind 4
- AstroPaper v6 테마, Pagefind(검색), astro-expressive-code(코드블록), Giscus(댓글)

## 명령어

```bash
npm run dev     # 개발 서버
npm run build   # 프로덕션 빌드 (astro check + pagefind 인덱싱 포함)
npm run preview # 빌드 결과 로컬 확인
```

## 프로젝트 구조

```
src/content/posts/     # 게시글 (frontmatter 필수: title, pubDatetime, description)
src/content/pages/     # 정적 페이지 (about 등)
src/i18n/lang/ko.ts    # 한국어 UI 문자열
src/components/        # 컴포넌트 (Giscus.astro 등)
src/layouts/           # 레이아웃
astro.config.ts        # 빌드 설정 (expressive-code 통합)
astro-paper.config.ts  # 사이트 설정 (제목·URL·소셜·언어·타임존)
public/                # 정적 자산 (로고·파비콘)
```

## 배포

`main` 브랜치 push 시 GitHub Actions 자동 빌드·배포 (`dist/` → GitHub Pages)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
