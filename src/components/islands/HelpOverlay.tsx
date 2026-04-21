import { useEffect, useState } from 'react';

interface MenuItem { key: string; label: string; href: string }

interface Props {
  menu: readonly MenuItem[];
}

export default function HelpOverlay({ menu }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      const inField = !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);

      if (e.key === '?' && !inField) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div className="help-scrim" onClick={() => setOpen(false)}>
      <div className="help-box" role="dialog" aria-modal="true" aria-label="Keyboard help" onClick={(e) => e.stopPropagation()}>
        <div className="help-head">
          <span className="help-title">// keyboard.help</span>
          <button className="help-close" aria-label="close" onClick={() => setOpen(false)}>esc</button>
        </div>

        <div className="help-body">
          <div className="help-sect">
            <div className="help-label">navigate</div>
            <ul>
              {menu.map((m) => (
                <li key={m.key}>
                  <kbd>{m.key}</kbd>
                  <span className="help-desc">{m.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="help-sect">
            <div className="help-label">general</div>
            <ul>
              <li><kbd>?</kbd><span className="help-desc">toggle this help</span></li>
              <li><kbd>Esc</kbd><span className="help-desc">close overlays</span></li>
            </ul>
          </div>
        </div>

        <div className="help-foot">tap outside or press esc to dismiss</div>
      </div>

      <style>{`
        .help-scrim {
          position: fixed; inset: 0; z-index: 100;
          background: color-mix(in oklab, var(--bg) 70%, transparent);
          backdrop-filter: blur(3px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: helpIn .15s ease-out both;
        }
        @keyframes helpIn { from { opacity: 0; } to { opacity: 1; } }

        .help-box {
          width: min(520px, 100%);
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          box-shadow: 0 20px 60px rgba(0,0,0,.5),
                      0 0 0 1px color-mix(in oklab, var(--accent) 25%, transparent);
          font-family: var(--mono-ui);
          color: var(--ink);
          overflow: hidden;
          animation: helpBox .22s cubic-bezier(.2,.75,.25,1) both;
        }
        @keyframes helpBox {
          from { transform: translateY(6px) scale(.98); opacity: 0; }
          to { transform: none; opacity: 1; }
        }

        .help-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 14px;
          border-bottom: 1px solid var(--line);
          background: var(--panel-2);
        }
        .help-title { font-size: 11px; color: var(--accent); letter-spacing: .1em; }
        .help-close {
          font-family: var(--mono-ui);
          font-size: 10px;
          padding: 2px 8px;
          border: 1px solid var(--line);
          background: var(--panel);
          color: var(--ink-muted);
          border-radius: 2px;
          cursor: pointer;
          letter-spacing: .12em;
          text-transform: uppercase;
        }
        .help-close:hover { color: var(--accent); border-color: var(--accent); }

        .help-body { padding: 18px 20px; display: flex; flex-direction: column; gap: 18px; }
        .help-sect ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
        .help-sect li {
          display: grid; grid-template-columns: 36px 1fr;
          gap: 12px;
          align-items: center;
          padding: 4px 0;
          font-size: 12.5px;
        }
        .help-label {
          font-size: 10px; color: var(--ink-muted);
          letter-spacing: .18em; text-transform: uppercase;
          margin-bottom: 8px;
        }
        .help-box kbd {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 28px; padding: 2px 6px;
          background: var(--panel-2);
          border: 1px solid var(--line);
          border-bottom-width: 2px;
          border-radius: 3px;
          font-family: var(--mono-ui);
          font-size: 11px;
          color: var(--ink);
        }
        .help-desc { color: var(--ink-dim); }

        .help-foot {
          padding: 8px 14px;
          border-top: 1px dashed var(--line);
          background: var(--panel-2);
          font-size: 10px;
          color: var(--ink-muted);
          letter-spacing: .1em;
          text-transform: uppercase;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
