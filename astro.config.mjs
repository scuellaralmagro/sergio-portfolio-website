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
  integrations: [
    react(),
    mdx(),
    sitemap({
      // Keep internal-only pages (styleguide, admin vault) out of the sitemap.
      filter: (page) => !page.includes('/styleguide') && !page.includes('/vault'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
