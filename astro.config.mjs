// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Static-first build. Output is `dist/` served directly by Cloudflare Pages.
// The @astrojs/cloudflare adapter is intentionally deferred to Phase 9, when
// the live RAG demo introduces an on-demand `/api/chat` endpoint.
// https://astro.build/config
export default defineConfig({
  site: 'https://sergiocuellar.dev',
  output: 'static',
  integrations: [
    react(),
    mdx(),
    sitemap({
      // Keep the internal component styleguide out of the sitemap.
      filter: (page) => !page.includes('/styleguide'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
