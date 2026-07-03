// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Static-first build. Output is `dist/`, served on Cloudflare Workers via
// Static Assets (see wrangler.jsonc). The @astrojs/cloudflare adapter is
// intentionally deferred to Phase 9, when the live RAG demo introduces an
// on-demand `/api/chat` endpoint.
// https://astro.build/config
export default defineConfig({
  site: 'https://sergiocuellar.dev',
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    mdx(),
    sitemap({
      // Keep internal-only and noindex pages (styleguide, admin vault, legal)
      // out of the sitemap.
      filter: (page) =>
        !page.includes('/styleguide') &&
        !page.includes('/vault') &&
        !page.includes('/privacy') &&
        !page.includes('/legal'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
