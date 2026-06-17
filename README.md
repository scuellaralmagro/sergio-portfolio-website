# Sergio Cuéllar — Portfolio

AI / LLM Engineer portfolio. Dark "starlit violet cosmos" design system, built with **Astro + React islands** and deployed on **Cloudflare Pages**.

> Architecture & roadmap: see [`ULTRAPLAN.md`](./ULTRAPLAN.md) — the source of truth for the build.

## Stack

- **Astro 5** (static output) + **React 19** islands for interactive/animated parts
- **Tailwind v4** (`@tailwindcss/vite`) wired to the design tokens in `src/styles/theme.css`
- **Framer Motion** for orchestrated motion (islands only; reduced-motion aware)
- **MDX** content collection for project case studies
- **Cloudflare Pages** hosting; Pages Functions/Workers reserved for the Phase 9 live AI demo

## Requirements

- Node `>=20` (repo pins **22** via `.nvmrc`)

## Commands

| Command           | Action                                                   |
| ----------------- | -------------------------------------------------------- |
| `npm install`     | Install dependencies                                     |
| `npm run dev`     | Local dev server at `http://localhost:4321`              |
| `npm run build`   | Type-check (`astro check`) + production build to `dist/` |
| `npm run preview` | Preview the production build locally                     |
| `npm run lint`    | ESLint (Astro/JS) + Stylelint (CSS)                      |
| `npm run format`  | Prettier write                                           |

## Project layout

```
src/
  pages/        routes (index, projects/[slug], 404)
  layouts/      BaseLayout (head, meta, JSON-LD)
  components/   primitives/ · sections/ · islands/ (React)
  content/      projects/*.mdx case studies
  styles/       theme.css (tokens) · global.css (base)
  lib/          motion presets, hooks, helpers
  data/         site config, expertise graph
public/         fonts, favicon, og images, robots.txt
```

## Design system

`src/styles/theme.css` is the **verbatim source of truth** for tokens (colors, type, spacing, radii, shadows) in Tailwind v4 `@theme` format. Component styles must reference tokens via `var(--…)` — never hardcode hex/spacing (enforced by Stylelint). Core rules: glassmorphism via **inset rim-light glows** (not drop shadows), AeonikPro 500 headings (never bold), single lavender accent, no semantic colors.

## Deployment (Cloudflare Pages)

Static build — no adapter required until Phase 9.

1. Push this repo to GitHub.
2. Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Build command: `npm run build` · Output directory: `dist` · Node version: `22`.
4. Add the custom domain `sergiocuellar.dev`.

Preview deployments are created automatically per branch/PR.
