// Rough reading time estimate. Strips markdown syntax, counts remaining words,
// divides by 220 wpm. Good enough for post headers — not a research tool.

const WPM = 220;

export function readingTime(body: string): { minutes: number; words: number } {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_~\-]+/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return { minutes: Math.max(1, Math.round(words / WPM)), words };
}
