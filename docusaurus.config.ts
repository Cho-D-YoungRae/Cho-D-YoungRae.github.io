import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: '심플스택',
  tagline: 'Cho-D-YoungRae의 기술 블로그',
  favicon: 'img/simplestack-logo.png',

  future: {
    v4: true,
  },

  url: 'https://cho-d-youngrae.github.io',
  baseUrl: '/',

  organizationName: 'Cho-D-YoungRae',
  projectName: 'Cho-D-YoungRae.github.io',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: {
          routeBasePath: '/',
          showReadingTime: false,
          postsPerPage: 50,
          blogSidebarCount: 0,
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} Cho-D-YoungRae`,
          },
          onInlineTags: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      require.resolve('@cmfcmf/docusaurus-search-local'),
      {
        indexDocs: false,
        indexBlog: true,
        indexPages: false,
        language: 'en',
      },
    ],
  ],

  themeConfig: {
    image: 'img/simplestack-logo.png',
    metadata: [
      {name: 'twitter:card', content: 'summary_large_image'},
    ],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '심플스택',
      logo: {
        alt: '심플스택 로고',
        src: 'img/simplestack-logo.png',
      },
      items: [
        {to: '/tags', label: '태그', position: 'left'},
        {to: '/archive', label: '아카이브', position: 'left'},
        {
          href: 'https://github.com/Cho-D-YoungRae',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'mailto:yrc9229@gmail.com',
          label: 'Email',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Cho-D-YoungRae.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
