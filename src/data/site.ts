/**
 * Central site configuration — single source of truth for identity,
 * SEO defaults, and social links. Consumed by BaseLayout and sections.
 */

export const site = {
  name: 'Sergio Cuéllar Almagro',
  shortName: 'Sergio Cuéllar',
  monogram: 'SC',
  role: 'AI / LLM Engineer',
  tagline: 'I orchestrate AI agents into systems that ship.',
  description:
    'AI / LLM Engineer specializing in agentic systems and LLM orchestration — LangChain/LangGraph, RAG with pgvector, multi-agent systems, and production deployments. Full-stack foundation in Python, TypeScript, Node and React.',
  url: 'https://sergiocuellar.dev',
  locale: 'en',
  location: 'Marbella, Spain',
  email: 'info@sergiocuellar.dev',
  ogImage: '/og/default.png',
  resumeUrl: '/SergioCuellar_AIDev_EN.pdf',
  /**
   * Cloudflare Web Analytics beacon token (privacy-first, cookieless — no
   * consent banner needed). Create a site under CF dashboard → Web Analytics
   * and paste its token here. Left empty = disabled; the beacon only loads in
   * production builds when this is set, so dev/preview stays untracked.
   */
  analyticsToken: '07a9662dd6b74570b96994dc4bfe39f5',
  /**
   * Base URL of the "Ask my portfolio" RAG API (Part A). Defaults to production;
   * set PUBLIC_API_BASE_URL (e.g. http://localhost:8787) to target a local Worker.
   */
  apiBaseUrl: import.meta.env.PUBLIC_API_BASE_URL ?? 'https://api.sergiocuellar.dev',
} as const;

export const socials = {
  github: 'https://github.com/scuellaralmagro',
  linkedin: 'https://www.linkedin.com/in/sergiocuellaralmagro/',
  email: `mailto:${site.email}`,
} as const;

/**
 * JSON-LD Person schema — improves recruiter/search/AI discoverability.
 */
export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: site.role,
  email: site.email,
  url: site.url,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Marbella',
    addressCountry: 'ES',
  },
  sameAs: [socials.github, socials.linkedin],
  knowsAbout: [
    'LLM Orchestration',
    'LangChain',
    'LangGraph',
    'Agentic Systems',
    'Retrieval-Augmented Generation',
    'Multi-Agent Systems',
    'Prompt Engineering',
    'Python',
    'TypeScript',
    'Node.js',
    'React',
  ],
} as const;
