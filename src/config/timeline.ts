export const timeline = [
  { year: String(new Date().getFullYear()), event: 'now', text: 'iOS engineer in Coimbra. Writing here more often.' },
  { year: '2020', event: 'hire',   text: 'joined GoodBarber as iOS developer' },
  { year: '2020', event: 'degree', text: 'BSc Software Development, ISEC (Coimbra)' },
  { year: '2016', event: 'degree', text: 'BSc Physics, Universidade de Coimbra' },
] as const;

export type TimelineRow = (typeof timeline)[number];
