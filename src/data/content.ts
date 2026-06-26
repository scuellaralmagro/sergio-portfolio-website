/**
 * Home-page content — single source of truth for the Experience timeline and
 * the Expertise capability clusters. Copy is drawn from the CV synthesis in
 * ULTRAPLAN §2.1/§5. No metrics are invented; quantified outcomes are added
 * only once Sergio confirms real numbers (ULTRAPLAN §15 Q4).
 */
import type { IconName } from '../components/primitives/Icon.astro';

export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  highlights: string[];
}

// Strict reverse-chronological by start date (most recent first).
export const experience: ExperienceEntry[] = [
  {
    role: 'AI Automation Developer',
    company: 'Simply Trade IN',
    period: 'Nov 2025 – Mar 2026',
    highlights: [
      'Built RAG support agents that encode domain expertise into grounded, accurate answers.',
      'Implemented semantic retrieval on Supabase with Postgres + pgvector.',
      'Shipped a conversational sales engine and automated social content through N8N pipelines.',
    ],
  },
  {
    role: 'Web App Developer — Backend / Agentic Systems',
    company: 'BoosterPrompt',
    period: 'Jun 2025 – Mar 2026',
    highlights: [
      'Built a multi-agent conversational booking system with LangChain and LangGraph, orchestrating tool-use across specialized agents.',
      'Delivered end-to-end WhatsApp booking through the Meta API, taking the system to real users in production.',
      'Hardened agent reliability with systematic prompt engineering.',
    ],
  },
  {
    role: 'Web Developer & Data Analyst',
    company: 'Freelance',
    period: 'Mar 2023 – Nov 2025',
    highlights: [
      'Designed and shipped web applications for clients, with SEO/SEM optimization.',
      'Ran business data analysis — sentiment and KPIs — in Python (Pandas, NLTK).',
    ],
  },
];

export interface ExpertiseCluster {
  name: string;
  icon: IconName;
  /** Concrete tools/skills in this capability area. */
  skills: string[];
  /** Subset of `skills` to emphasise (filled, glowing chips). */
  flagships: string[];
}

export const expertise: ExpertiseCluster[] = [
  {
    name: 'Agent Orchestration',
    icon: 'network',
    skills: [
      'LangGraph',
      'LangChain',
      'Multi-agent routing',
      'Tool use',
      'Stateful agents (memory)',
      'Human-in-the-loop',
    ],
    flagships: ['LangGraph', 'LangChain'],
  },
  {
    name: 'Retrieval / RAG',
    icon: 'database',
    skills: ['RAG', 'RAFT', 'pgvector / HNSW', 'Embeddings', 'Semantic search'],
    flagships: ['RAG', 'pgvector / HNSW'],
  },
  {
    name: 'LLM in Production',
    icon: 'workflow',
    skills: [
      'Prompt engineering',
      'Evals (LLM-as-judge)',
      'Observability (Langfuse)',
      'SSE streaming',
      'WhatsApp / Meta API',
    ],
    flagships: ['Prompt engineering', 'Evals (LLM-as-judge)'],
  },
  {
    name: 'Engineering & Automation',
    icon: 'code',
    skills: [
      'Python',
      'N8N',
      'FastAPI',
      'TypeScript / Node.js',
      'React / Next.js',
      'PostgreSQL / Supabase',
      'Docker',
    ],
    flagships: ['Python', 'N8N'],
  },
];

// Project case studies live in the `projects` content collection
// (src/content/projects/*.mdx) — see src/content.config.ts.
