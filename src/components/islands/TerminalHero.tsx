import { useEffect, useMemo, useRef, useState } from 'react';

type Line = { k: string; v: string; o?: 'accent' | 'cyan' | 'red' | 'dim'; delay?: number; tab?: number };

interface Props {
  lines: Line[];
  sessionLabel?: string;
}

type OutLine = { k: string; v: string; o?: 'accent' | 'cyan' | 'dim' };
type CmdResult = string[] | '__CLEAR__';

const ACCENTS = ['green', 'amber', 'red', 'blue', 'purple', 'mono'] as const;
const ROUTES: Record<string, string> = {
  '/': '/', '~': '/', 'home': '/',
  'about': '/about/', 'projects': '/projects/', 'writing': '/writing/',
  'resume': '/resume/', 'résumé': '/resume/', 'contact': '/contact/',
  'uses': '/uses/', 'links': '/links/', 'privacy': '/privacy/',
};

function applyAccent(a: string) {
  try {
    document.documentElement.dataset.accent = a;
    const raw = localStorage.getItem('jaPortfolio:prefs');
    const p = raw ? JSON.parse(raw) : {};
    p.accent = a;
    localStorage.setItem('jaPortfolio:prefs', JSON.stringify(p));
  } catch {}
}

function cowsay(msg: string): string[] {
  const text = msg || 'moo.';
  const bar = '-'.repeat(text.length + 2);
  return [
    ` ${bar}`,
    `< ${text} >`,
    ` ${bar}`,
    '        \\   ^__^',
    '         \\  (oo)\\_______',
    '            (__)\\       )\\/\\',
    '                ||----w |',
    '                ||     ||',
  ];
}

function runCommand(raw: string): CmdResult {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  const [cmd, ...args] = trimmed.split(/\s+/);

  switch (cmd) {
    case 'help':
      return ['help   whoami   ls   cd   theme   man   cowsay   clear'];

    case 'whoami':
      return ['joão aleixo — ios engineer / tinkerer'];

    case 'ls':
      return ['about/   projects/   writing/   resume/   contact/   uses/   links/'];

    case 'cd':
    case 'open': {
      const t = (args[0] || '').replace(/\/+$/, '').toLowerCase();
      if (!t) return ['usage: cd <name> — try `ls` to see what\'s available'];
      const rh = t.match(/^rabbit-holes(?:\/(.+))?$/);
      if (rh) {
        const slug = rh[1];
        const href = slug ? `/about/#${slug}` : '/about/#rabbit-holes';
        setTimeout(() => { window.location.href = href; }, 220);
        return [`cd ${args[0]}`, 'connecting...'];
      }
      const href = ROUTES[t];
      if (!href) return [`cd: ${args[0]}: no such directory`];
      setTimeout(() => { window.location.href = href; }, 220);
      return [`cd ${args[0]}`, 'connecting...'];
    }

    case 'theme': {
      const t = (args[0] || '').toLowerCase();
      if (!t) return [`usage: theme <${ACCENTS.join('|')}>`];
      if (!ACCENTS.includes(t as (typeof ACCENTS)[number])) {
        return [`theme: '${t}': not a known accent`, `try one of: ${ACCENTS.join(', ')}`];
      }
      applyAccent(t);
      return [`accent → ${t}`];
    }

    case 'man':
      if (!args[0]) return ['what manual page do you want?'];
      return ['RTFM.'];

    case 'cowsay':
      return cowsay(args.join(' '));

    case 'clear':
      return '__CLEAR__';

    default:
      return [`${cmd}: command not found. try 'help'.`];
  }
}

export default function TerminalHero({ lines, sessionLabel = 'SESSION 001' }: Props) {
  const [shown, setShown] = useState(0);
  const [typed, setTyped] = useState(0); // chars typed on the current prompt line
  const [focused, setFocused] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<OutLine[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1); // -1 = live buffer
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const ready = shown >= lines.length;

  useEffect(() => {
    let cancelled = false;
    let tid: ReturnType<typeof setTimeout> | null = null;

    const wait = (fn: () => void, ms: number) => {
      tid = setTimeout(() => { if (!cancelled) fn(); }, ms);
    };

    let i = 0;
    let c = 0;

    const isPrompt = (l: Line) => l.k === '>' || l.k === '$';
    const typeDelay = () => 32 + Math.random() * 48; // 32–80ms per char

    const step = () => {
      if (cancelled || i >= lines.length) {
        setShown(lines.length);
        setTyped(0);
        return;
      }
      const line = lines[i];

      // output line (or blank prompt) — commit after a short beat
      if (!isPrompt(line) || line.v.trim().length === 0) {
        wait(() => {
          setShown(i + 1);
          setTyped(0);
          c = 0;
          i += 1;
          step();
        }, isPrompt(line) ? 140 : 180);
        return;
      }

      // prompt line — type char-by-char, pausing on tab-autocomplete markers
      if (c < line.v.length) {
        if (line.tab != null && c === line.tab) {
          wait(() => {
            c = line.v.length;
            setTyped(c);
            step();
          }, 380);
          return;
        }
        c += 1;
        setTyped(c);
        wait(step, typeDelay());
        return;
      }

      // fully typed — pause (Enter), commit, advance
      wait(() => {
        setShown(i + 1);
        setTyped(0);
        c = 0;
        i += 1;
        step();
      }, 300);
    };

    wait(step, 300); // initial beat before first keystroke

    return () => {
      cancelled = true;
      if (tid) clearTimeout(tid);
    };
  }, [lines]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [output.length, focused]);

  const focus = () => {
    if (!ready) return;
    if (focused) return;
    inputRef.current?.focus();
  };

  const submit = () => {
    const cmd = input;
    const trimmed = cmd.trim();
    const nextHistory = trimmed ? [...history, trimmed] : history;
    if (trimmed) setHistory(nextHistory);

    const echo: OutLine = { k: '$', v: cmd || ' ' };

    if (!trimmed) {
      setOutput((o) => [...o, echo]);
      setInput('');
      setHistIdx(-1);
      return;
    }

    const result = runCommand(trimmed);

    if (result === '__CLEAR__') {
      setOutput([]);
      setInput('');
      setHistIdx(-1);
      return;
    }

    const outLines: OutLine[] = result.map((line) => ({ k: ' ', v: line || ' ' }));
    setOutput((o) => [...o, echo, ...outLines]);
    setInput('');
    setHistIdx(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      inputRef.current?.blur();
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const nextIdx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(nextIdx);
      setInput(history[nextIdx]);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx === -1) return;
      const nextIdx = histIdx + 1;
      if (nextIdx >= history.length) {
        setHistIdx(-1);
        setInput('');
      } else {
        setHistIdx(nextIdx);
        setInput(history[nextIdx]);
      }
      return;
    }
  };

  const showHint = useMemo(
    () => ready && !focused && output.length === 0,
    [ready, focused, output.length],
  );

  return (
    <div className={`term ${focused ? 'focused' : ''} ${ready ? 'ready' : ''}`} onClick={focus}>
      <div className="term-head">
        <div className="tdots"><i className="r" /><i className="y" /><i className="g" /></div>
        <div className="tname">joao@homelab — -zsh — 80×24</div>
        <div className="tbadge">{focused ? 'CONNECTED' : sessionLabel}</div>
      </div>
      <div className="term-body" ref={bodyRef}>
        {lines.map((l, i) => {
          const isPrompt = l.k === '>' || l.k === '$';
          if (i < shown) {
            return (
              <div key={i} className={`tline on ${l.o || ''}`}>
                <span className="tk">{l.k}</span>
                <span className="tv">{l.v || '\u00A0'}</span>
              </div>
            );
          }
          if (i === shown && isPrompt && l.v.trim().length > 0) {
            return (
              <div key={i} className={`tline on typing ${l.o || ''}`}>
                <span className="tk">{l.k}</span>
                <span className="tv">
                  {l.v.slice(0, typed)}
                  <span className="caret intro" />
                </span>
              </div>
            );
          }
          return (
            <div key={i} className={`tline off ${l.o || ''}`}>
              <span className="tk">{l.k}</span>
              <span className="tv">{l.v || '\u00A0'}</span>
            </div>
          );
        })}

        {output.map((l, i) => (
          <div key={`o-${i}`} className={`tline on ${l.o || ''}`}>
            <span className="tk">{l.k}</span>
            <span className="tv">{l.v}</span>
          </div>
        ))}

        {ready && (
          <div className={`tline on prompt ${focused ? 'live' : 'idle'}`}>
            <span className="tk">{'$'}</span>
            <span className="tv tinput">
              <span className="typed">{input}</span>
              <span className="caret" />
              {showHint && (
                <span className="hint">click to type · try <span className="hint-kbd">help</span></span>
              )}
            </span>
            <input
              ref={inputRef}
              className="thidden"
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); setHistIdx(-1); }}
              onKeyDown={onKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              aria-label="terminal input"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>
        )}
      </div>

      <style>{`
      .term {
        border: 1px solid var(--line);
        border-radius: var(--radius-lg);
        background: linear-gradient(180deg, var(--bg), var(--panel));
        overflow: hidden;
        box-shadow: var(--shadow-crt);
        transition: border-color .18s ease, box-shadow .18s ease;
      }
      .term.ready { cursor: text; }
      .term.focused {
        border-color: color-mix(in oklab, var(--accent) 55%, var(--line));
        box-shadow:
          var(--shadow-crt),
          0 0 0 1px color-mix(in oklab, var(--accent) 25%, transparent),
          0 0 28px color-mix(in oklab, var(--accent) 18%, transparent);
      }
      .term-head {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        border-bottom: 1px solid var(--line);
        background: rgba(255,255,255,.02);
      }
      .tdots { display: flex; gap: 6px; }
      .tdots i { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
      .tdots .r { background: #ff5f57; }
      .tdots .y { background: #febc2e; }
      .tdots .g { background: #28c840; }
      .tname { text-align: center; font-family: var(--mono-ui); font-size: 11px; color: var(--ink-muted); letter-spacing: .04em; }
      .tbadge {
        font-family: var(--mono-ui); font-size: 9px; letter-spacing: .2em;
        color: var(--accent);
        border: 1px solid color-mix(in oklab, var(--accent) 40%, var(--line));
        padding: 2px 6px; border-radius: 2px;
        transition: color .15s ease, border-color .15s ease;
      }
      .term-body {
        padding: 20px 22px 24px;
        font-family: var(--mono-body); font-size: 14px; color: var(--ink);
        height: 340px;
        overflow-y: auto;
      }
      .tline {
        display: grid; grid-template-columns: 18px 1fr; gap: 8px;
        padding: 3px 0;
        min-height: calc(14px * 1.5);
      }
      .tline.off { visibility: hidden; }
      .tline.on  { animation: termIn .22s cubic-bezier(.2,.7,.2,1) both; }
      @keyframes termIn { from { opacity: 0; transform: translateY(2px); } }
      .tk { color: var(--accent); }
      .tv { white-space: pre-wrap; word-break: break-word; }
      .tline.accent .tv { color: var(--accent); text-shadow: 0 0 6px color-mix(in oklab, var(--accent) 35%, transparent); }
      .tline.cyan .tv { color: #7dd3fc; }
      .tline.dim .tv { color: var(--ink-muted); }
      .tline.red .tv { color: #ff6b6b; }

      .prompt { position: relative; }
      .tinput { display: inline-flex; align-items: center; gap: 0; min-height: 1.1em; }
      .typed { color: var(--ink); }
      .caret {
        display: inline-block;
        width: 1ch; height: 1.1em;
        background: var(--accent);
        margin-left: 1px;
        vertical-align: -2px;
      }
      .prompt.live .caret { animation: termblink 1.05s steps(2) infinite; }
      .prompt.idle .caret {
        animation: termblink 1.8s steps(2) infinite;
        opacity: .55;
      }
      .caret.intro {
        animation: termblink .9s steps(2) infinite;
        margin-left: 0;
      }
      @keyframes termblink { 50% { opacity: 0; } }

      .hint {
        margin-left: 14px;
        color: var(--ink-muted);
        font-size: 12px;
        letter-spacing: .02em;
      }
      .hint-kbd {
        color: var(--accent);
        border: 1px solid color-mix(in oklab, var(--accent) 40%, var(--line));
        padding: 0 5px;
        border-radius: 2px;
        font-size: 11px;
      }

      .thidden {
        position: absolute;
        inset: 0;
        width: 100%; height: 100%;
        opacity: 0;
        border: 0;
        background: transparent;
        padding: 0;
        margin: 0;
        pointer-events: none;
      }
      `}</style>
    </div>
  );
}
