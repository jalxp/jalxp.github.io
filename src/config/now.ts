export const now = [
  { key: 'building',  value: 'an RTS in Godot' },
  { key: 'tinkering', value: 'a network exploration tool on a raspberry pi' },
  { key: 'running',   value: 'a proxmox homelab' },
  { key: 'learning',  value: 'rust, and to draw' },
  { key: 'day job',   value: 'shipping iOS at GoodBarber' },
] as const;

export type NowRow = (typeof now)[number];
