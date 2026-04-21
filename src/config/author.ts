export const author = {
  name: 'João Aleixo',
  initials: 'J · A',
  role: 'iOS Engineer',
  employer: 'GoodBarber',
  location: 'Coimbra, Portugal',
  timezone: 'Europe/Lisbon',       // UTC+0 / +1
  email: 'hello@joaoaleixo.com',

  since: '2020-09-19',

  avatar: {
    mark: '{ja}',
    image: null as string | null,
  },

  socials: [
    { name: 'GitHub',        handle: 'jalxp',          url: 'https://github.com/jalxp' },
    { name: 'LinkedIn',      handle: 'jalxp',          url: 'https://www.linkedin.com/in/jalxp/' },
    { name: 'Stack Overflow',handle: '6512773/jalxp',  url: 'https://stackoverflow.com/users/6512773/jalxp' },
    { name: 'Email',         handle: 'hello@joaoaleixo.com', url: 'mailto:hello@joaoaleixo.com' },
  ],
} as const;

export type Author = typeof author;
