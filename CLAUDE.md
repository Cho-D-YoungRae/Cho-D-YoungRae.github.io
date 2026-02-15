# 심플스택 (Cho-D-YoungRae.github.io)

Docusaurus 3.9.2 기반 블로그 전용 사이트 (`docs: false`, `routeBasePath: '/'`)

## 기술 스택

- Node.js 24, TypeScript 5.6, React 19
- `@docusaurus/preset-classic`, `@cmfcmf/docusaurus-search-local`

## 명령어

```bash
npm start     # 개발 서버
npm run build # 프로덕션 빌드
npm run serve # 빌드 결과 로컬 확인
npm run typecheck # 타입 체크
```

## 프로젝트 구조

```
blog/                  # 게시글 (YYYY-MM-DD-slug.md)
src/css/custom.css     # 커스텀 스타일
src/theme/             # Docusaurus 테마 스위즐 (wrap)
static/img/            # 정적 이미지
docusaurus.config.ts   # 사이트 설정
```

## 배포

`main` 브랜치 push 시 GitHub Actions 자동 빌드·배포 (GitHub Pages)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->