import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { site } from '../../config/site';
import { author } from '../../config/author';

// font fetched once per build, reused across renders
let regularPromise: Promise<ArrayBuffer> | null = null;
let boldPromise: Promise<ArrayBuffer> | null = null;

const FONT_REGULAR = 'https://fonts.gstatic.com/s/spacemono/v17/i7dPIFZifjKcF5UAWdDRUEY.ttf';
const FONT_BOLD    = 'https://fonts.gstatic.com/s/spacemono/v17/i7dMIFZifjKcF5UAWdDRaPpZYFI.ttf';

async function loadFont(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`font fetch failed (${res.status}): ${url}`);
  return await res.arrayBuffer();
}

function getRegular() { return regularPromise ??= loadFont(FONT_REGULAR); }
function getBold()    { return boldPromise    ??= loadFont(FONT_BOLD); }

interface Card {
  slug: string;
  kicker: string;
  title: string;
  subtitle: string;
  tag?: string;
}

export async function getStaticPaths() {
  const posts = await getCollection('writing', ({ data }) => !data.draft);
  const postCards: Card[] = posts.map((p) => ({
    slug: p.id,
    kicker: `// writing / ${p.data.pubDate.toISOString().slice(0, 10)}`,
    title: p.data.title,
    subtitle: p.data.description,
    tag: p.data.tags?.[0],
  }));

  const pageCards: Card[] = [
    { slug: 'default', kicker: '// joaoaleixo.com', title: site.title, subtitle: site.tagline },
    { slug: 'about',    kicker: '// man joao',          title: 'about',    subtitle: 'the long-form readme' },
    { slug: 'projects', kicker: '// ls ./projects',     title: 'projects', subtitle: "what i'm building" },
    { slug: 'writing',  kicker: '// cat ./writing.log', title: 'writing',  subtitle: 'tutorials, deep dives, rants' },
    { slug: 'contact',  kicker: '// mail -s',           title: 'contact',  subtitle: 'say hi' },
    { slug: 'uses',     kicker: '// cat ./uses.md',     title: 'uses',     subtitle: 'the boring list' },
    { slug: 'links',    kicker: '// ls ./links',        title: 'links',    subtitle: 'everywhere i am online' },
  ];

  return [...postCards, ...pageCards].map((c) => ({ params: { slug: c.slug }, props: { card: c } }));
}

export const GET: APIRoute = async ({ props }) => {
  const card = props.card as Card;
  const [regular, bold] = await Promise.all([getRegular(), getBold()]);

  const bg = '#05070a';
  const panel = '#0a0f0b';
  const accent = '#00ff9c';
  const line = '#1a2620';
  const ink = '#e8f3ea';
  const inkDim = '#a8b3a7';
  const inkMuted = '#5d6b5e';

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          background: bg,
          display: 'flex',
          flexDirection: 'column',
          padding: '56px',
          fontFamily: 'Space Mono',
          color: ink,
          position: 'relative',
        },
        children: [
          // window-chrome bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 18px',
                background: panel,
                border: `1px solid ${line}`,
                borderRadius: '6px 6px 0 0',
                fontSize: '18px',
                color: inkMuted,
              },
              children: [
                { type: 'div', props: { style: { width: 14, height: 14, borderRadius: 99, background: '#ff5f57' } } },
                { type: 'div', props: { style: { width: 14, height: 14, borderRadius: 99, background: '#febc2e' } } },
                { type: 'div', props: { style: { width: 14, height: 14, borderRadius: 99, background: '#28c840' } } },
                { type: 'div', props: { style: { marginLeft: 22, letterSpacing: '0.04em' }, children: `${card.slug}.md` } },
              ],
            },
          },

          // body
          {
            type: 'div',
            props: {
              style: {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '44px 48px',
                border: `1px solid ${line}`,
                borderTop: 'none',
                borderRadius: '0 0 6px 6px',
                background: panel,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', flexDirection: 'column', gap: '16px' },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '22px',
                            color: accent,
                            letterSpacing: '0.06em',
                          },
                          children: card.kicker,
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '64px',
                            fontWeight: 700,
                            lineHeight: 1.15,
                            color: ink,
                            letterSpacing: '0.01em',
                            // clamp long titles — satori honors line-clamp via overflow: hidden
                            display: '-webkit-box',
                            // @ts-ignore satori-style
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3,
                            overflow: 'hidden',
                          },
                          children: card.title,
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '26px',
                            color: inkDim,
                            lineHeight: 1.5,
                            display: '-webkit-box',
                            // @ts-ignore satori-style
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden',
                            marginTop: '8px',
                          },
                          children: card.subtitle,
                        },
                      },
                    ],
                  },
                },

                // footer row
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: `1px dashed ${line}`,
                      paddingTop: '22px',
                      fontSize: '20px',
                      color: inkMuted,
                      letterSpacing: '0.08em',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', alignItems: 'center', gap: '14px' },
                          children: [
                            { type: 'div', props: { style: { color: accent, fontWeight: 700 }, children: author.avatar.mark } },
                            { type: 'div', props: { children: author.name.toLowerCase() } },
                          ],
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { color: card.tag ? accent : inkMuted },
                          children: card.tag ? `#${card.tag}` : 'joaoaleixo.com',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Space Mono', data: regular, weight: 400, style: 'normal' },
        { name: 'Space Mono', data: bold, weight: 700, style: 'normal' },
      ],
    },
  );

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(png, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
