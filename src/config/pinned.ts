export const pinned = [
  { key: 'location',     value: 'Coimbra, PT' },
  { key: 'timezone',     value: 'UTC+0 / +1' },
  { key: 'day job',      value: 'iOS engineer at GoodBarber', accent: true },
  { key: 'night mode',   value: 'tinkerer' },
  { key: 'daily driver', value: '' },
  { key: 'editor',       value: '' },
  { key: 'keyboard',     value: '' },
  { key: 'coffee',       value: '' },
] as const;

export type PinnedRow = (typeof pinned)[number];
