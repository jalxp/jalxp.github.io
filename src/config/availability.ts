// Availability signals on /contact. Edit these any time — they render as a
// colored dot + short label. Use 'green' / 'amber' / 'red' for the status.

export const availability = [
  { status: 'green', key: 'collaborations', value: 'interesting problems only' },
  { status: 'green', key: 'coffee chats',   value: 'always yes' },
  { status: 'amber', key: 'full-time',      value: 'happy where I am; listening if it\'s special' },
  { status: 'red',   key: 'crypto / web3',  value: 'politely no' },
] as const;

export type AvailabilityRow = (typeof availability)[number];
