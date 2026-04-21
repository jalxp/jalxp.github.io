import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    kind: z.enum(['shipping-credit', 'homelab', 'game', 'side', 'tool', 'ios-app']),
    year: z.string(),
    // shipping / live / beta / wip / archived / in-progress
    status: z.enum(['shipping', 'live', 'beta', 'wip', 'archived', 'in-progress']),
    tech: z.array(z.string()).default([]),
    description: z.string(),
    link: z.string().url().optional(),
    repo: z.string().url().optional(),
    order: z.number().default(100), // lower = higher in the list
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing, projects };
