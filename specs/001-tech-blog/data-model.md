# Data Model: 심플스택 기술 블로그

**Feature Branch**: `001-tech-blog`
**Date**: 2026-02-15
**Spec**: [spec.md](./spec.md)

## 개요

Docusaurus 블로그는 파일 기반 CMS이다. 데이터는 Markdown/MDX 파일의 front matter와 YAML 설정 파일로 관리된다. 별도 데이터베이스나 API는 없다.

## 엔티티

### 1. Post (게시글)

**저장 위치**: `blog/` 디렉토리 내 Markdown/MDX 파일
**파일명 규칙**: `YYYY-MM-DD-slug.md` 또는 `YYYY-MM-DD-slug/index.md` (이미지 포함 시)

#### Front Matter 스키마

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `title` | string | **필수** | - | 게시글 제목 |
| `slug` | string | 선택 | 파일명에서 자동 생성 | URL 슬러그 |
| `date` | date | 선택 | 파일명의 날짜 | 작성일 (YYYY-MM-DD) |
| ~~`authors`~~ | ~~string[]~~ | ~~선택~~ | - | 미사용 — 단일 작성자이므로 생략 |
| `tags` | string[] | 선택 | `[]` | 태그 목록 |
| `description` | string | **필수** | - | 요약 설명 (SEO/OG용, 160자 이내 권장) |
| `image` | string | 선택 | `themeConfig.image` | 게시글 대표 이미지 |
| `draft` | boolean | 선택 | `false` | `true`: 프로덕션 빌드 제외 |
| `unlisted` | boolean | 선택 | `false` | `true`: 목록/피드/사이트맵 제외, URL 직접 접근만 가능 |
| `hide_table_of_contents` | boolean | 선택 | `false` | `true`: TOC 숨김 |

#### 상태 전이

```
draft: true  ──→  (front matter 변경)  ──→  발행 (draft/unlisted 없음 또는 false)
                                         ↕
                    unlisted: true  ←──→  발행 (draft/unlisted 없음 또는 false)
```

- **초안(Draft)**: `draft: true` — 어디에도 노출되지 않음. 개발 서버에서만 확인 가능
- **숨김(Unlisted)**: `unlisted: true` — 목록/피드/사이트맵 제외, URL 직접 접근 가능
- **발행(Published)**: `draft`와 `unlisted` 모두 `false` 또는 생략 — 모든 곳에 노출

#### 예시

```yaml
---
title: "React Server Components 이해하기"
tags: [react, server-components]
description: "React Server Components의 핵심 개념과 사용법을 알아봅니다."
date: 2026-02-15
---
```

> **Note**: `authors` 필드는 사용하지 않는다. 단일 작성자 블로그이므로 navbar의 GitHub/Email 링크로 작성자 정보를 제공한다. `blog/authors.yml` 파일도 생성하지 않는다.

### 2. Tag (태그)

**저장 위치**: 게시글 front matter에 인라인으로 정의
**별도 `tags.yml` 사용하지 않음** — 게시글에서 사용되는 태그가 자동으로 태그 페이지에 반영

#### 특성

- 태그 이름은 소문자 영문 + 하이픈 권장 (URL 친화적)
- 하나의 게시글에 0개 이상의 태그 부여 가능
- 태그 목록 페이지(`/tags`)와 태그별 게시글 목록(`/tags/[tag]`)은 Docusaurus가 자동 생성

## 파일 구조 (콘텐츠)

```
blog/
├── 2026-02-15-first-post.md        # 단일 파일 게시글
└── 2026-02-20-post-with-images/    # 이미지 포함 게시글
    ├── index.md
    └── image.png
```

## 생성되는 라우트 (Docusaurus 자동)

| 라우트 | 설명 | 소스 |
|--------|------|------|
| `/` | 블로그 메인 (게시글 목록, 최신순) | `blog.routeBasePath: '/'` |
| `/page/2` | 게시글 목록 2페이지 | 자동 페이지네이션 |
| `/YYYY/MM/DD/slug` | 게시글 상세 | 게시글 파일 |
| `/tags` | 태그 목록 페이지 | 자동 생성 |
| `/tags/[tag]` | 태그별 게시글 목록 | 자동 생성 |
| `/archive` | 아카이브 (연도별) | 자동 생성 |
| `/rss.xml` | RSS 2.0 피드 | feedOptions |
| `/atom.xml` | Atom 피드 | feedOptions |
| `/sitemap.xml` | 사이트맵 | sitemap 플러그인 |
