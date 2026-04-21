// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.joaoaleixo.com',
  integrations: [react(), sitemap()],
  vite: {
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
  },
});