import { useEffect, useState } from 'react';
import TerminalHero from './TerminalHero';

type Line = { k: string; v: string; o?: 'accent' | 'cyan' | 'red' | 'dim'; delay?: number; tab?: number };

export default function Terminal404() {
  const [lines, setLines] = useState<Line[] | null>(null);

  useEffect(() => {
    const path = window.location.pathname || '/';
    setLines([
      { k: '$', v: `cd ${path}` },
      { k: ' ', v: `zsh: no such file or directory: ${path}`, o: 'red' },
      { k: ' ', v: ' ' },
      { k: ' ', v: 'available destinations:', o: 'dim' },
      { k: ' ', v: '  about/   projects/   writing/   resume/   contact/   uses/   links/', o: 'cyan' },
      { k: ' ', v: ' ' },
      { k: ' ', v: "try: cd <name>, or type 'help'.", o: 'dim' },
    ]);
  }, []);

  if (!lines) return <div style={{ minHeight: 340 }} />;
  return <TerminalHero lines={lines} sessionLabel="SESSION 404" />;
}
