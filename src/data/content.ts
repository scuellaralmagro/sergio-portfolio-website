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
  /** Most-AI → least; rendered top-to-bottom. */
  highlights: string[];
}

export const experience: ExperienceEntry[] = [
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
    role: 'AI Automation Developer',
    company: 'Simply Trade IN / Weebu',
    period: 'Nov 2025 – Mar 2026',
    highlights: [
      'Built RAG support agents that encode domain expertise into grounded, accurate answers.',
      'Implemented semantic retrieval on Supabase with Postgres + pgvector.',
      'Shipped a conversational sales engine and automated social content through N8N pipelines.',
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
  /** The "stars" in this constellation — concrete tools/skills. */
  skills: string[];
}

export const expertise: ExpertiseCluster[] = [
  {
    name: 'Orchestration',
    icon: 'network',
    skills: ['LangChain', 'LangGraph', 'Tool-use', 'Multi-agent systems'],
  },
  {
    name: 'Retrieval',
    icon: 'database',
    skills: ['RAG / RAFT', 'pgvector', 'Supabase', 'Semantic search'],
  },
  {
    name: 'Engineering',
    icon: 'code',
    skills: ['Python', 'TypeScript', 'Node.js', 'React / Next.js'],
  },
  {
    name: 'Automation & Ops',
    icon: 'workflow',
    skills: ['N8N', 'Docker', 'Meta API', 'OpenAI API'],
  },
];

export interface Project {
  title: string;
  summary: string;
  stack: string[];
  /** Public repo URL. Omit for private/employer-owned projects. */
  repo?: string;
  /** Live deployment URL, if any. */
  live?: string;
  /** Tag shown when there is no public repo (e.g. "Private repo"). */
  note?: string;
}

export const projects: Project[] = [
  {
    title: 'Kynetix — AI Gym Trainer & Nutrition Coach',
    summary:
      'A full-stack AI training and nutrition coach. A FastAPI + LangGraph backend runs a streaming, multi-node agent — supervisor routing, workout analysis, and plan generation — grounded by a RAG pipeline over a pgvector knowledge base, with a React PWA for chat, live workout tracking, and nutrition logging.',
    stack: ['LangGraph', 'FastAPI', 'OpenAI', 'pgvector (RAG)', 'React PWA'],
    note: 'Private repo',
  },
  {
    title: 'Pneumonia Detection from Chest X-rays',
    summary:
      'Deep-learning classifier that flags pneumonia in chest X-rays — a from-scratch CNN plus MobileNetV2 transfer learning, with Grad-CAM heatmaps for explainability.',
    stack: ['Python', 'Keras', 'OpenCV', 'MobileNetV2', 'Grad-CAM'],
    repo: 'https://github.com/scuellaralmagro/chest-xray-pneumonia-classifier',
  },
  {
    title: 'Airline Tweet Sentiment Analysis',
    summary:
      'Sentiment analysis and classification of airline tweets with NLTK, over the Twitter US Airline Sentiment dataset from Kaggle.',
    stack: ['Python', 'NLTK', 'scikit-learn'],
    repo: 'https://github.com/scuellaralmagro/airline-sentiment-analysis',
  },
];
