/**
 * Home-page content — single source of truth for the Experience timeline and
 * the Expertise capability clusters. Locale-keyed (en/es); sections read the
 * array for the current `Astro.currentLocale`. Copy is drawn from the CV
 * synthesis in ULTRAPLAN §2.1/§5. No metrics are invented; quantified outcomes
 * are added only once Sergio confirms real numbers (ULTRAPLAN §15 Q4).
 */
import type { IconName } from '../components/primitives/Icon.astro';
import type { Locale } from '../i18n/utils';

export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  highlights: string[];
}

// Strict reverse-chronological by start date (most recent first).
export const experience: Record<Locale, ExperienceEntry[]> = {
  en: [
    {
      role: 'AI Automation Developer',
      company: 'Simply Trade IN',
      period: 'Nov 2025 – Mar 2026',
      highlights: [
        'Built RAG support agents that encode domain expertise into grounded, accurate answers.',
        'Implemented semantic retrieval on Supabase with Postgres + pgvector.',
        'Shipped a conversational sales engine and automated social content through N8N pipelines.',
        'Automated operational pipelines across several departments with N8N, weaving AI into day-to-day workflows.',
        'Built Python and N8N ETL dataflows integrating multiple third-party APIs, backed by relational Postgres/Supabase schemas.',
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
        'Engineered the backend and data flows in Node.js, covered by unit and integration tests in Vitest.',
        'Built a notifications service on the Resend API and designed the corporate website.',
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
  ],
  es: [
    {
      role: 'Desarrollador de Automatización con IA',
      company: 'Simply Trade IN',
      period: 'Nov 2025 – Mar 2026',
      highlights: [
        'Construí agentes de soporte RAG que codifican el conocimiento del dominio en respuestas fundamentadas y precisas.',
        'Implementé recuperación semántica en Supabase con Postgres + pgvector.',
        'Desplegué un motor de ventas conversacional y automaticé la generación de contenido social mediante pipelines de N8N.',
        'Automaticé pipelines operativos en varios departamentos con N8N, integrando la IA en los flujos de trabajo del día a día.',
        'Construí flujos de datos ETL en Python y N8N que integran múltiples APIs de terceros, sobre esquemas relacionales de Postgres/Supabase.',
      ],
    },
    {
      role: 'Desarrollador de Aplicaciones Web — Backend / Sistemas Agénticos',
      company: 'BoosterPrompt',
      period: 'Jun 2025 – Mar 2026',
      highlights: [
        'Construí un sistema de reservas conversacional multiagente con LangChain y LangGraph, orquestando el uso de herramientas entre agentes especializados.',
        'Entregué reservas por WhatsApp de extremo a extremo a través de la API de Meta, llevando el sistema a usuarios reales en producción.',
        'Reforcé la fiabilidad de los agentes con ingeniería de prompts sistemática.',
        'Desarrollé el backend y los flujos de datos en Node.js, cubiertos con tests unitarios y de integración en Vitest.',
        'Construí un servicio de notificaciones sobre la API de Resend y diseñé el sitio web corporativo.',
      ],
    },
    {
      role: 'Desarrollador Web y Analista de Datos',
      company: 'Freelance',
      period: 'Mar 2023 – Nov 2025',
      highlights: [
        'Diseñé y entregué aplicaciones web para clientes, con optimización SEO/SEM.',
        'Realicé análisis de datos de negocio —sentimiento y KPIs— en Python (Pandas, NLTK).',
      ],
    },
  ],
};

export interface ExpertiseCluster {
  name: string;
  icon: IconName;
  /** Concrete tools/skills in this capability area. */
  skills: string[];
  /** Subset of `skills` to emphasise (filled, glowing chips). */
  flagships: string[];
}

export const expertise: Record<Locale, ExpertiseCluster[]> = {
  en: [
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
      ],
      flagships: ['Prompt engineering', 'Evals (LLM-as-judge)'],
    },
    {
      name: 'Machine Learning & Data Science',
      icon: 'layers',
      skills: [
        'scikit-learn',
        'PyTorch / Keras',
        'Deep learning (CNNs)',
        'Computer vision (OpenCV)',
        'NLP (NLTK)',
        'Grad-CAM (explainability)',
        'Pandas',
      ],
      flagships: ['scikit-learn', 'PyTorch / Keras'],
    },
    {
      name: 'Engineering',
      icon: 'code',
      skills: [
        'Python',
        'FastAPI',
        'TypeScript / Node.js',
        'React / Next.js',
        'PostgreSQL / Supabase',
        'Docker',
        'Hexagonal architecture',
      ],
      flagships: ['Python', 'FastAPI'],
    },
    {
      name: 'Automation & Integration',
      icon: 'bot',
      skills: [
        'N8N',
        'REST API integrations',
        'WhatsApp / Meta API',
        'ZohoDesk API',
        'CI/CD',
        'ETL pipelines',
      ],
      flagships: ['N8N', 'REST API integrations'],
    },
  ],
  es: [
    {
      name: 'Orquestación de Agentes',
      icon: 'network',
      skills: [
        'LangGraph',
        'LangChain',
        'Enrutado multiagente',
        'Uso de herramientas',
        'Agentes con estado (memoria)',
        'Human-in-the-loop',
      ],
      flagships: ['LangGraph', 'LangChain'],
    },
    {
      name: 'Recuperación / RAG',
      icon: 'database',
      skills: ['RAG', 'RAFT', 'pgvector / HNSW', 'Embeddings', 'Búsqueda semántica'],
      flagships: ['RAG', 'pgvector / HNSW'],
    },
    {
      name: 'LLM en Producción',
      icon: 'workflow',
      skills: [
        'Ingeniería de prompts',
        'Evaluaciones (LLM como juez)',
        'Observabilidad (Langfuse)',
        'Streaming SSE',
      ],
      flagships: ['Ingeniería de prompts', 'Evaluaciones (LLM como juez)'],
    },
    {
      name: 'Machine Learning y Ciencia de Datos',
      icon: 'layers',
      skills: [
        'scikit-learn',
        'PyTorch / Keras',
        'Deep learning (CNNs)',
        'Visión por computador (OpenCV)',
        'NLP (NLTK)',
        'Grad-CAM (explicabilidad)',
        'Pandas',
      ],
      flagships: ['scikit-learn', 'PyTorch / Keras'],
    },
    {
      name: 'Ingeniería',
      icon: 'code',
      skills: [
        'Python',
        'FastAPI',
        'TypeScript / Node.js',
        'React / Next.js',
        'PostgreSQL / Supabase',
        'Docker',
        'Arquitectura hexagonal',
      ],
      flagships: ['Python', 'FastAPI'],
    },
    {
      name: 'Automatización e Integración',
      icon: 'bot',
      skills: [
        'N8N',
        'Integraciones de API REST',
        'WhatsApp / Meta API',
        'ZohoDesk API',
        'CI/CD',
        'Pipelines ETL',
      ],
      flagships: ['N8N', 'Integraciones de API REST'],
    },
  ],
};

// Project case studies live in the `projects` content collection
// (src/content/projects/*.mdx) — see src/content.config.ts.
