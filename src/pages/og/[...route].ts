/**
 * Build-time OG image generation (ULTRAPLAN §10).
 * Renders branded 1200×630 social cards for the home page and each case study,
 * styled to the "starlit violet cosmos" system: near-black void background,
 * lavender accent border, Lilac-White title, Ash description.
 *
 * Output paths: /og/default.png (home + fallback) and /og/<project-id>.png.
 * Referenced via `og:image` in BaseLayout (site.ogImage) and [slug].astro.
 */
import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';
import { site } from '../../data/site';

const projects = await getCollection('projects', ({ data }) => !data.draft);

// Map of OG image keys → card content. `default` covers the English home page
// and any page without a per-route image; `es/default` is the Spanish home
// card. Each project entry (en/* and es/*) gets its own card keyed by its id,
// so /og/en/<slug>.png and /og/es/<slug>.png carry the right language.
const pages: Record<string, { title: string; description: string }> = {
  default: { title: site.name, description: `${site.role} — ${site.tagline}` },
  'es/default': {
    title: site.name,
    description: 'Ingeniero de IA / LLM — Orquesto agentes de IA en sistemas que llegan a producción.',
  },
  ...Object.fromEntries(
    projects.map((entry) => [
      entry.id,
      { title: entry.data.title, description: entry.data.summary },
    ]),
  ),
};

// Design tokens as canvaskit RGB triples (0–255).
const VOID: [number, number, number] = [3, 0, 20]; // #030014
const DEEP_INDIGO: [number, number, number] = [16, 9, 58]; // #10093a
const ACCENT: [number, number, number] = [147, 130, 255]; // #9382ff
const LILAC_WHITE: [number, number, number] = [244, 240, 255]; // #f4f0ff
const ASH: [number, number, number] = [168, 166, 183]; // #a8a6b7

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    logo: { path: './public/favicon.svg', size: [72] },
    bgGradient: [VOID, DEEP_INDIGO],
    border: { color: ACCENT, width: 8, side: 'inline-start' },
    padding: 72,
    font: {
      title: {
        color: LILAC_WHITE,
        size: 64,
        weight: 'Medium',
        lineHeight: 1.2,
        families: ['Inter', 'Noto Sans'],
      },
      description: {
        color: ASH,
        size: 30,
        weight: 'Normal',
        lineHeight: 1.4,
        families: ['Inter', 'Noto Sans'],
      },
    },
    format: 'PNG',
  }),
});
