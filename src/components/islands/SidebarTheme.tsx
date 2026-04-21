import { useEffect, useState } from 'react';

type Accent = 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'mono';
type Theme = 'dark' | 'light';

interface Prefs {
  accent: Accent;
  theme: Theme;
  fontpair: 'space' | 'plex' | 'jet';
  scanlines: boolean;
}

const DEFAULTS: Prefs = {
  accent: 'green',
  theme: 'dark',
  fontpair: 'plex',
  scanlines: false,
};
const STORAGE_KEY = 'jaPortfolio:prefs';

const ACCENTS: { id: Accent; label: string; hex: string }[] = [
  { id: 'green',  label: 'phosphor', hex: '#00ff9c' },
  { id: 'amber',  label: 'amber',    hex: '#ffb454' },
  { id: 'red',    label: 'red',      hex: '#ff5f57' },
  { id: 'blue',   label: 'ibm blue', hex: '#58a6ff' },
  { id: 'purple', label: 'ultra',    hex: '#c38bff' },
  { id: 'mono',   label: 'mono',     hex: '#d4d4d4' },
];

function load(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch { return DEFAULTS; }
}

function apply(p: Prefs) {
  const html = document.documentElement;
  html.dataset.accent = p.accent;
  html.dataset.theme = p.theme;
  html.dataset.fontpair = p.fontpair;
  document.body.classList.toggle('scanlines', p.scanlines);
}

export default function SidebarTheme() {
  const [prefs, setPrefs] = useState<Prefs>(() =>
    typeof window === 'undefined' ? DEFAULTS : load(),
  );

  useEffect(() => {
    apply(prefs);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch {}
  }, [prefs]);

  const set = <K extends keyof Prefs>(k: K, v: Prefs[K]) =>
    setPrefs((p) => ({ ...p, [k]: v }));

  return (
    <div className="theme-body">
      <div className="theme-row">
        {ACCENTS.map((a) => (
          <button
            key={a.id}
            className={`theme-sw ${prefs.accent === a.id ? 'on' : ''}`}
            onClick={() => set('accent', a.id)}
            title={a.label}
            aria-label={`accent ${a.label}`}
          >
            <span style={{ background: a.hex, boxShadow: `0 0 8px ${a.hex}` }} />
          </button>
        ))}
      </div>
      <div className="theme-toggles">
        <button
          className={`theme-btn ${prefs.theme === 'dark' ? 'on' : ''}`}
          onClick={() => set('theme', prefs.theme === 'dark' ? 'light' : 'dark')}
          title="Toggle light / dark"
        >
          <span className="tb-ic">{prefs.theme === 'dark' ? '●' : '○'}</span>
          <span>{prefs.theme === 'dark' ? 'dark' : 'paper'}</span>
        </button>
        <button
          className={`theme-btn ${prefs.scanlines ? 'on' : ''}`}
          onClick={() => set('scanlines', !prefs.scanlines)}
          title="Toggle CRT scanlines"
        >
          <span className="tb-ic">{prefs.scanlines ? '≡' : '─'}</span>
          <span>scanlines</span>
        </button>
      </div>

      <style>{`
      .theme-body { display:flex; flex-direction: column; gap: 10px; }
      .theme-row { display:flex; gap: 6px; }
      .theme-sw {
        width: 26px; height: 26px;
        padding: 0;
        background: var(--panel-2);
        border: 1px solid var(--line);
        border-radius: 3px;
        cursor: pointer;
        display:flex; align-items:center; justify-content:center;
        transition: border-color .15s ease, transform .08s ease;
      }
      .theme-sw span { display:inline-block; width: 12px; height: 12px; border-radius: 2px; }
      .theme-sw:hover { transform: translateY(-1px); }
      .theme-sw.on {
        border-color: var(--ink);
        box-shadow: 0 0 0 1px var(--ink);
      }
      .theme-toggles { display:flex; flex-direction: column; gap: 4px; }
      .theme-btn {
        display:flex; align-items:center; gap: 8px;
        padding: 5px 8px;
        background: var(--panel-2);
        border: 1px solid var(--line-soft);
        color: var(--ink-dim);
        font-family: var(--mono-ui); font-size: 11px;
        border-radius: 3px; cursor: pointer;
        text-align: left;
        transition: all .15s ease;
      }
      .theme-btn:hover { color: var(--ink); border-color: var(--line); }
      .theme-btn.on {
        color: var(--accent);
        border-color: color-mix(in oklab, var(--accent) 40%, var(--line));
        background: color-mix(in oklab, var(--accent) 8%, var(--panel-2));
      }
      .theme-btn .tb-ic { color: var(--accent); width: 12px; text-align: center; }
      `}</style>
    </div>
  );
}
