import { useState, type FormEvent } from 'react';

interface Props {
  to: string;
  from: string;
}

export default function ContactForm({ to, from }: Props) {
  const [form, setForm] = useState({ name: '', email: '', msg: '' });
  const [sent, setSent] = useState(false);
  const [focus, setFocus] = useState<string | null>(null);

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.msg) return;
    const subject = encodeURIComponent(`Hello from ${form.name} — ${from}`);
    const body = encodeURIComponent(
      `${form.msg}\n\n—\nfrom: ${form.name} <${form.email}>\nsent via ${from}`
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="c-sent">
        <pre className="c-sent-ascii">{` ┌─────────────────────────────┐
 │  TRANSMISSION SUCCESSFUL     │
 └─────────────────────────────┘`}</pre>
        <div className="c-sent-body">
          <div>
            thanks, <span className="acc">{form.name}</span>.
          </div>
          <div>
            your mail client should have opened. if nothing happened, send me a
            note directly at{' '}
            <a href={`mailto:${to}`} className="acc">{to}</a>.
          </div>
        </div>
        <button
          className="btn"
          onClick={() => {
            setSent(false);
            setForm({ name: '', email: '', msg: '' });
          }}
        >
          ↺ send another
        </button>

        <style>{formStyles}</style>
      </div>
    );
  }

  return (
    <form className="c-form" onSubmit={onSubmit}>
      <Row
        id="c-name" label="name" value={form.name} focus={focus}
        onFocus={() => setFocus('name')} onBlur={() => setFocus(null)}
        onChange={(v) => set('name', v)} placeholder="ada lovelace"
      />
      <Row
        id="c-email" label="email" type="email" value={form.email} focus={focus}
        onFocus={() => setFocus('email')} onBlur={() => setFocus(null)}
        onChange={(v) => set('email', v)} placeholder="ada@analytical.engine"
      />
      <Row
        id="c-msg" label="message" area value={form.msg} focus={focus}
        onFocus={() => setFocus('msg')} onBlur={() => setFocus(null)}
        onChange={(v) => set('msg', v)} placeholder="tell me what you're building..."
      />

      <div className="c-actions">
        <button className="btn primary" type="submit">▸ transmit</button>
        <button
          className="btn"
          type="button"
          onClick={() => setForm({ name: '', email: '', msg: '' })}
        >↺ reset</button>
        <div className="c-note">opens your mail client — no server, no tracking.</div>
      </div>

      <style>{formStyles}</style>
    </form>
  );
}

interface RowProps {
  id: string;
  label: string;
  value: string;
  focus: string | null;
  placeholder: string;
  type?: string;
  area?: boolean;
  onChange: (v: string) => void;
  onFocus: () => void;
  onBlur: () => void;
}

function Row({ id, label, value, focus, placeholder, type = 'text', area, onChange, onFocus, onBlur }: RowProps) {
  const fieldKey = id.replace('c-', '');
  return (
    <div className="c-row">
      <label htmlFor={id} className="c-label">
        <span className="c-prompt">{label}</span>
        <span className="c-op">:=</span>
      </label>
      <div className={`c-input ${area ? 'area' : ''} ${focus === fieldKey ? 'focus' : ''}`}>
        <span className="c-cursor">{focus === fieldKey ? '▸' : '·'}</span>
        {area ? (
          <textarea
            id={id} rows={6}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus} onBlur={onBlur}
            placeholder={placeholder}
          />
        ) : (
          <input
            id={id} type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus} onBlur={onBlur}
            placeholder={placeholder}
            autoComplete="off"
          />
        )}
      </div>
    </div>
  );
}

const formStyles = `
.c-form { display: flex; flex-direction: column; gap: 16px; }
.c-row { display: grid; grid-template-columns: 120px 1fr; gap: 14px; align-items: start; }
@media (max-width: 700px) { .c-row { grid-template-columns: 1fr; } }

.c-label { display: flex; gap: 8px; align-items: center; padding-top: 10px; font-family: var(--mono-ui); font-size: 12px; }
.c-prompt { color: var(--accent); }
.c-op { color: var(--ink-muted); }

.c-input {
  display: grid; grid-template-columns: 22px 1fr;
  align-items: center;
  border: 1px solid var(--line);
  background: var(--panel-2);
  padding: 6px 10px;
  border-radius: 2px;
  transition: border-color .15s ease, box-shadow .15s ease;
}
.c-input.focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent),
              0 0 12px color-mix(in oklab, var(--accent) 30%, transparent);
}
.c-input.area { align-items: flex-start; padding-top: 8px; }
.c-cursor { color: var(--accent); font-size: 12px; line-height: 20px; }
.c-input input, .c-input textarea {
  width: 100%;
  background: transparent; border: none; outline: none;
  color: var(--ink);
  font-family: var(--mono-body); font-size: 13px;
  padding: 3px 0;
  resize: vertical;
  line-height: 1.5;
}
.c-input input::placeholder, .c-input textarea::placeholder { color: var(--ink-muted); font-style: italic; }

.c-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.c-note { margin-left: auto; font-family: var(--mono-ui); font-size: 11px; color: var(--ink-muted); }

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--ink);
  font-family: var(--mono-ui);
  font-size: 12px;
  letter-spacing: .06em;
  cursor: pointer;
  transition: all .15s ease;
}
.btn:hover {
  color: var(--accent);
  border-color: color-mix(in oklab, var(--accent) 50%, var(--line));
  background: color-mix(in oklab, var(--accent) 8%, transparent);
}
.btn.primary { background: var(--accent); color: var(--bg); border-color: var(--accent); }
.btn.primary:hover {
  background: transparent;
  color: var(--accent);
  border-color: var(--accent);
}

.c-sent {
  display: flex; flex-direction: column; gap: 16px; align-items: flex-start;
  padding: 20px 0;
}
.c-sent-ascii {
  font-family: var(--mono-ui);
  font-size: 13px;
  margin: 0;
  color: var(--accent);
  text-shadow: 0 0 8px color-mix(in oklab, var(--accent) 50%, transparent);
}
.c-sent-body { font-family: var(--mono-body); font-size: 14px; color: var(--ink); line-height: 1.9; }
.c-sent-body .acc { color: var(--accent); }
`;
