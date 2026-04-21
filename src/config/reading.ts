export type ReadStatus = 'reading' | 'queued' | 'finished';

export const reading: { title: string; author: string; status: ReadStatus }[] = [
  { title: 'The Alignment Problem',              author: 'Brian Christian', status: 'reading' },
  { title: 'Blame!',                             author: 'Tsutomu Nihei',   status: 'reading' },
  { title: 'Drawing on the Right Side of the Brain', author: 'Betty Edwards', status: 'reading' },
];
