import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * `projects` — typed case-study collection (ULTRAPLAN §8.4). Frontmatter holds
 * the metadata (hero + grid); the MDX body holds the Problem → Architecture →
 * Role & decisions → Outcome narrative. Both the home grid and /projects/[slug]
 * read from this single source, so adding a project = adding one .mdx file.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    role: z.string().optional(),
    company: z.string().optional(),
    period: z.string().optional(),
    stack: z.array(z.string()),
    /** Public repo URL. Omit for private/employer-owned projects. */
    repo: z.string().url().optional(),
    /** Live deployment URL, if any. */
    live: z.string().url().optional(),
    /** Optional cover image path under /public. */
    cover: z.string().optional(),
    /** Tag shown when there is no public repo, e.g. "Private repo". */
    note: z.string().optional(),
    featured: z.boolean().default(true),
    /** Sort order for the grid and prev/next navigation (low → high). */
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
