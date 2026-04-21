import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../config/site';
import { author } from '../config/author';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('writing', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${site.title} — writing`,
    description: site.description,
    site: context.site ?? site.url,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/writing/${p.id}/`,
      author: `${author.email} (${author.name})`,
      categories: p.data.tags,
    })),
    customData: `<language>${site.lang}</language>`,
  });
}
