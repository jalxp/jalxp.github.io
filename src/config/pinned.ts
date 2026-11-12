export const pinned = [
  { key: 'location',     value: 'Coimbra, PT' },
  { key: 'timezone',     value: 'UTC+0 / +1' },
  { key: 'day job',      value: 'iOS engineer at GoodBarber', accent: true },
  { key: 'night mode',   value: 'tinkerer' },
  { key: 'daily driver', value: 'MacBook Pro M4 Pro' },
  { key: 'editor',       value: 'Xcode' },
  { key: 'keyboard',     value: 'Ducky One 2' },
] as const;

export type PinnedRow = (typeof pinned)[number];
