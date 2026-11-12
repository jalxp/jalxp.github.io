export const now = [
  { key: 'building',  value: 'Drawdown 391, a horror game — my studio Confuse a Cat Games' },
  { key: 'tinkering', value: 'a raspberry pi for learning how wi-fi works' },
  { key: 'running',   value: 'a proxmox homelab' },
  { key: 'day job',   value: 'shipping iOS at GoodBarber' },
] as const;

export type NowRow = (typeof now)[number];
