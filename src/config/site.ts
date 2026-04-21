export const site = {
  url: 'https://joaoaleixo.com',
  title: 'João Aleixo',
  tagline: 'iOS engineer by day, chronic tinkerer by night.',
  description:
    'Personal site of João Aleixo — iOS engineer based in Coimbra. ' +
    'Writing about Swift, homelabs, networking, and the occasional rabbit hole.',
  lang: 'en',
  locale: 'en_US',

  // set to 'owner/repo' to show a "view source" link on posts; null hides it
  repo: null as string | null,
  postsPath: 'site/src/content/writing',

  // order matters — positions map to keyboard shortcuts 1..N
  menu: [
    { key: '1', label: 'home',     href: '/' },
    { key: '2', label: 'about',    href: '/about/' },
    { key: '3', label: 'projects', href: '/projects/' },
    { key: '4', label: 'writing',  href: '/writing/' },
    { key: '5', label: 'résumé',   href: '/resume/' },
    { key: '6', label: 'contact',  href: '/contact/' },
  ],

  legal: [
    { label: 'privacy', href: '/privacy/' },
  ],

  copyright: `© ${new Date().getFullYear()} João Aleixo. All rights reserved.`,

  defaults: {
    accent: 'amber',     // green | amber | red | blue | purple | mono
    theme: 'dark',       // dark | light
    fontpair: 'plex',    // space | plex | jet
    scanlines: true,
  },
} as const;

export type SiteConfig = typeof site;
