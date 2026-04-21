// Pinned facts shown on the /about page. Think of this as a `uses` section.
// Unverified items are left empty — fill them in or delete the key.

export const pinned = [
  { key: 'location',     value: 'Coimbra, PT' },
  { key: 'timezone',     value: 'UTC+0 / +1' },
  { key: 'day job',      value: 'iOS engineer at GoodBarber', accent: true },
  { key: 'night mode',   value: 'tinkerer' },
  { key: 'daily driver', value: '' },  // TODO: fill in (M1/M2/M3 MacBook?)
  { key: 'editor',       value: '' },  // TODO: fill in
  { key: 'keyboard',     value: '' },  // TODO: fill in
  { key: 'coffee',       value: '' },  // TODO: fill in
] as const;

export type PinnedRow = (typeof pinned)[number];
