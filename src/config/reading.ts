// Currently on the shelf. Shown in the `// reading.log` panel on home.
// Keep it short — the panel is a snapshot, not a library.

export type ReadStatus = 'reading' | 'queued' | 'finished';

export const reading: { title: string; author: string; status: ReadStatus }[] = [
  { title: 'The Alignment Problem',              author: 'Brian Christian', status: 'reading' },
  { title: 'Blame!',                             author: 'Tsutomu Nihei',   status: 'reading' },
  { title: 'Drawing on the Right Side of the Brain', author: 'Betty Edwards', status: 'reading' },
];
