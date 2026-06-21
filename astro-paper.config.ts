import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://cho-d-youngrae.github.io",
    title: "심플스택",
    description: "Cho-D-YoungRae의 기술 블로그",
    author: "Cho-D-YoungRae",
    profile: "https://github.com/Cho-D-YoungRae",
    ogImage: "default-og.jpg",
    lang: "ko",
    timezone: "Asia/Seoul",
    dir: "ltr",
  },
  posts: {
    perPage: 10,
    perIndex: 5,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/Cho-D-YoungRae/Cho-D-YoungRae.github.io/edit/main/",
    },
    search: "pagefind",
  },
  socials: [
    {
      name: "github",
      url: "https://github.com/Cho-D-YoungRae",
      linkTitle: "Cho-D-YoungRae on GitHub",
    },
    {
      name: "mail",
      url: "mailto:yrc9229@gmail.com",
      linkTitle: "Send an email to Cho-D-YoungRae",
    },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});