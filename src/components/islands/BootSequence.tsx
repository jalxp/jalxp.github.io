import { useEffect, useState } from 'react';

const LINES = [
  'JA-OS v2.0 ▓ POST...',
  'memcheck: 64K OK',
  'mount /home/joao ... OK',
  'launch ui ... OK',
];

const SESSION_FLAG = 'jaPortfolio:bootShown';

export default function BootSequence() {
  const [shouldBoot, setShouldBoot] = useState(false);
  const [shown, setShown] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // one-shot per browser session — don't replay on client nav
    try {
      if (sessionStorage.getItem(SESSION_FLAG)) return;
      sessionStorage.setItem(SESSION_FLAG, '1');
    } catch {}
    setShouldBoot(true);
  }, []);

  useEffect(() => {
    if (!shouldBoot) return;
    const timers = LINES.map((_, i) =>
      setTimeout(() => setShown((s) => Math.max(s, i + 1)), 220 + i * 320),
    );
    const dismiss = setTimeout(() => setGone(true), 2400);
    const onKey = () => setGone(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onKey);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(dismiss);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onKey);
    };
  }, [shouldBoot]);

  if (!shouldBoot || gone) return null;

  return (
    <div className="boot" role="presentation" aria-hidden="true">
      <div className="boot-inner">
        {LINES.slice(0, shown).map((l, i) => (
          <div key={i} className="boot-line">
            <span className="boot-caret">&gt;</span> {l}
          </div>
        ))}
        {shown >= LINES.length && (
          <div className="boot-line">
            <span className="boot-caret">&gt;</span>
            <span className="boot-blink" />
          </div>
        )}
      </div>

      <style>{`
      .boot {
        position: fixed; inset: 0; z-index: 9998;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 60px;
        animation: boot-fade-out .3s 2.1s forwards;
      }
      @keyframes boot-fade-out { to { opacity: 0; } }
      .boot-inner {
        font-family: var(--mono-body), ui-monospace, monospace;
        font-size: 14px;
        color: var(--accent, #00ff9c);
        text-shadow: 0 0 6px currentColor;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .boot-caret { color: #fff; margin-right: 8px; }
      .boot-blink {
        display: inline-block;
        width: 1ch;
        height: 1.1em;
        background: currentColor;
        margin-left: 6px;
        animation: bootblink 1s steps(2) infinite;
      }
      @keyframes bootblink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
