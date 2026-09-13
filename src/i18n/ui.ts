import type { Locale } from './utils';

/**
 * UI string dictionary. `en` values are verbatim from the components (extracting
 * them changes no visible English copy); `es` are the Spanish translations.
 * Both locales MUST share an identical key set — enforced by ui.test.ts.
 * Strings that embed inline markup (an <em>, a mid-sentence link) are split so
 * the component can reassemble them; see about.p1/p2 and showcase.source*.
 */
export const ui = {
  en: {
    // Nav
    'nav.about': 'About',
    'nav.expertise': 'Expertise',
    'nav.showcase': 'Showcase',
    'nav.ask': 'Ask',
    'nav.projects': 'Projects',
    'nav.experience': 'Experience',
    'nav.cta': 'Get in touch',
    'nav.homeAria': 'home',

    // Hero
    'hero.headline.a': 'I orchestrate AI agents into',
    'hero.headline.b': 'systems that ship.',
    'hero.sub':
      'Agentic systems, LangGraph orchestration, and RAG architectures — designed, built, and deployed in production.',
    'hero.ctaWork': 'View my work',
    'hero.ctaContact': 'Get in touch',

    // About
    'about.eyebrow': 'About',
    'about.title': 'Who I am',
    'about.subtitle':
      'An AI/LLM engineer who turns manual processes into scalable agentic architectures.',
    'about.p1':
      'I build the systems that make AI <em>act</em> — multi-agent orchestrations and retrieval pipelines that move from prototype to production. My focus is agentic design with LangChain and LangGraph, RAG over Postgres and pgvector, and the prompt engineering that makes all of it reliable enough to put in front of real users over channels like WhatsApp.',
    'about.p2':
      'Underneath the AI work is a full-stack and data foundation — Python, TypeScript, Node, and React, plus the database and automation tooling to wire services together end-to-end. It means I can take an idea from architecture through deployment myself, rather than stopping at the demo.',

    // Expertise
    'expertise.eyebrow': 'Expertise',
    'expertise.title': 'Capabilities',
    'expertise.subtitle': 'Six areas where I build — flagship tools highlighted.',

    // AI Showcase
    'showcase.eyebrow': 'AI Showcase',
    'showcase.title': 'How I build agentic systems',
    'showcase.subtitle':
      'The real architectures behind my work — agents are stars, orchestration is the lines between them.',
    'showcase.sourcePre': 'The orchestration and RAG diagrams are the real architecture behind ',
    'showcase.sourceLink': 'Kynetix',
    'showcase.sourcePost':
      ' — my full-stack AI training & nutrition coach. The guardrail is the core of ',
    'showcase.source2Link': 'Agentic Job Engine',
    'showcase.source2Post': ', the job-search engine I built and use in my own search.',
    'showcase.diagram1Title': 'Multi-agent orchestration',
    'showcase.diagram1Caption':
      'A LangGraph supervisor classifies each message and routes it to one of six specialists — single-workout or full-week programming, profile updates, the nutrition sub-graph, post-workout analysis, or general chat. Programming grounds plans in a pgvector RAG store and deterministic services (1RM, fatigue, TDEE); analysis reads the relational workout history; nutrition commits via a human-in-the-loop confirm. Conversation state persists through a Postgres checkpointer and replies stream token-by-token over SSE.',
    'showcase.guardrailTitle': 'Guardrails: anchored generation',
    'showcase.guardrailCaption':
      "The model never writes free prose about a candidate's experience — it drafts a CV out of source_key references to Profile items. A pure validator, with no database, network or LLM in the loop, rejects any key the Profile doesn't contain, so an invented job or skill fails before anything is saved. Only a draft that passes has its keys resolved back to real Profile text and rendered to PDF for a human to review.",
    'showcase.diagram2Title': 'RAG retrieval pipeline',
    'showcase.diagram2Caption':
      "Reference knowledge (kinesiology, nutrition) is embedded and stored once; at query time the question is embedded, matched against a pgvector HNSW index, and the top-k chunks ground the model's answer — no ungrounded guessing.",

    // Ask portfolio
    'ask.eyebrow': 'Ask my portfolio',
    'ask.title': 'Ask my portfolio',
    'ask.subtitle':
      'A live RAG assistant, grounded in my real experience — the architecture above, working.',

    // Projects
    'projects.eyebrow': 'Projects',
    'projects.title': 'Flagship work',
    'projects.subtitle': 'Selected agentic and LLM systems I designed and built end to end.',
    'projects.more': 'More of my work on GitHub',
    'projects.caseStudy': 'Case study',
    'projects.code': 'Code',
    'projects.live': 'Live',

    // Experience
    'experience.eyebrow': 'Experience',
    'experience.title': "Where I've shipped",
    'experience.subtitle': 'A short spine of AI-first roles, most recent first.',

    // Contact
    'contact.eyebrow': 'Contact',
    'contact.title': "Let's build something",
    'contact.subtitle': 'Open to AI/LLM engineering roles. The fastest way to reach me is email.',
    'contact.email': 'Email me',
    'contact.resume': 'Download résumé (PDF)',
    'contact.github': 'GitHub',
    'contact.linkedin': 'LinkedIn',
    'contact.locationPrefix': 'Based in ',
    'contact.location': 'Marbella, Spain',

    // Footer
    'footer.colophonSuffix': 'Built with Astro on Cloudflare.',
    'footer.backToTop': 'back to top',
    'footer.privacy': 'Privacy',
    'footer.legal': 'Legal notice',

    // Case study pages
    'caseStudy.back': '← All projects',
    'caseStudy.viewCode': 'View code',
    'caseStudy.live': 'Live',
    'caseStudy.prev': '← Previous',
    'caseStudy.next': 'Next →',

    // 404
    'notFound.title': 'Lost in the void',
    'notFound.msg': "This page drifted out of orbit. Let's get you back on course.",
    'notFound.home': 'Return home',
    'notFound.pageTitle': 'Page not found',

    // Language toggle
    'lang.toggleLabel': 'Language',
    'lang.en': 'EN',
    'lang.es': 'ES',

    // SEO — home
    'seo.homeTitle': 'Sergio Cuéllar Almagro — AI / LLM Engineer',
    'seo.homeDescription':
      'AI / LLM Engineer specializing in agentic systems and LLM orchestration — LangChain/LangGraph, RAG with pgvector, multi-agent systems, and production deployments. Full-stack foundation in Python, TypeScript, Node and React.',
  },
  es: {
    // Nav
    'nav.about': 'Sobre mí',
    'nav.expertise': 'Especialidad',
    'nav.showcase': 'Cómo trabajo',
    'nav.ask': 'Pregunta',
    'nav.projects': 'Proyectos',
    'nav.experience': 'Experiencia',
    'nav.cta': 'Hablemos',
    'nav.homeAria': 'inicio',

    // Hero
    'hero.headline.a': 'Orquesto agentes de IA en',
    'hero.headline.b': 'sistemas que llegan a producción.',
    'hero.sub':
      'Sistemas agénticos, orquestación con LangGraph y arquitecturas RAG — diseñados, construidos y desplegados en producción.',
    'hero.ctaWork': 'Ver mi trabajo',
    'hero.ctaContact': 'Hablemos',

    // About
    'about.eyebrow': 'Sobre mí',
    'about.title': 'Quién soy',
    'about.subtitle':
      'Un ingeniero de IA/LLM que convierte procesos manuales en arquitecturas agénticas escalables.',
    'about.p1':
      'Construyo los sistemas que hacen que la IA <em>actúe</em> — orquestaciones multiagente y pipelines de recuperación que pasan del prototipo a producción. Me centro en el diseño agéntico con LangChain y LangGraph, en RAG sobre Postgres y pgvector, y en la ingeniería de prompts que lo hace todo lo bastante fiable como para ponerlo delante de usuarios reales por canales como WhatsApp.',
    'about.p2':
      'Bajo el trabajo de IA hay una base full-stack y de datos — Python, TypeScript, Node y React —, además de las herramientas de base de datos y automatización para conectar servicios de extremo a extremo. Significa que puedo llevar una idea desde la arquitectura hasta el despliegue yo mismo, en lugar de quedarme en la demo.',

    // Expertise
    'expertise.eyebrow': 'Especialidad',
    'expertise.title': 'Capacidades',
    'expertise.subtitle':
      'Seis áreas en las que construyo — con las herramientas principales destacadas.',

    // AI Showcase
    'showcase.eyebrow': 'Muestra de IA',
    'showcase.title': 'Cómo construyo sistemas agénticos',
    'showcase.subtitle':
      'Las arquitecturas reales detrás de mi trabajo — los agentes son estrellas; la orquestación, las líneas que los unen.',
    'showcase.sourcePre': 'Los diagramas de orquestación y RAG son la arquitectura real de ',
    'showcase.sourceLink': 'Kynetix',
    'showcase.sourcePost':
      ' — mi entrenador de IA full-stack de entrenamiento y nutrición. El guardrail es el núcleo de ',
    'showcase.source2Link': 'Agentic Job Engine',
    'showcase.source2Post':
      ', el motor de búsqueda de empleo que construí y uso en mi propia búsqueda.',
    'showcase.diagram1Title': 'Orquestación multiagente',
    'showcase.diagram1Caption':
      'Un supervisor de LangGraph clasifica cada mensaje y lo enruta a uno de seis especialistas — programación de un solo entrenamiento o de la semana completa, actualización de perfil, el subgrafo de nutrición, análisis post-entrenamiento o conversación general. La programación fundamenta los planes en un almacén RAG con pgvector y en servicios deterministas (1RM, fatiga, TDEE); el análisis lee el historial relacional de entrenamientos; la nutrición se confirma con validación humana. El estado de la conversación persiste mediante un checkpointer de Postgres y las respuestas se transmiten token a token por SSE.',
    'showcase.guardrailTitle': 'Guardrails: generación anclada',
    'showcase.guardrailCaption':
      'El modelo nunca escribe texto libre sobre la experiencia de un candidato: redacta el CV a partir de referencias source_key a elementos del Perfil. Un validador puro, sin base de datos, red ni LLM de por medio, rechaza cualquier clave que el Perfil no contenga, de modo que un puesto o una habilidad inventados fallan antes de guardar nada. Solo un borrador que lo supera resuelve sus claves al texto real del Perfil y se genera en PDF para que lo revise una persona.',
    'showcase.diagram2Title': 'Pipeline de recuperación RAG',
    'showcase.diagram2Caption':
      'El conocimiento de referencia (kinesiología, nutrición) se vectoriza y almacena una vez; en tiempo de consulta la pregunta se vectoriza, se compara con un índice HNSW de pgvector y los fragmentos más relevantes fundamentan la respuesta del modelo — sin conjeturas infundadas.',

    // Ask portfolio
    'ask.eyebrow': 'Pregunta a mi portfolio',
    'ask.title': 'Pregunta a mi portfolio',
    'ask.subtitle':
      'Un asistente RAG en vivo, fundamentado en mi experiencia real — la arquitectura de arriba, funcionando.',

    // Projects
    'projects.eyebrow': 'Proyectos',
    'projects.title': 'Trabajo destacado',
    'projects.subtitle':
      'Sistemas agénticos y de LLM seleccionados que diseñé y construí de extremo a extremo.',
    'projects.more': 'Más de mi trabajo en GitHub',
    'projects.caseStudy': 'Ver más',
    'projects.code': 'Código',
    'projects.live': 'En vivo',

    // Experience
    'experience.eyebrow': 'Experiencia',
    'experience.title': 'Dónde he trabajado',
    'experience.subtitle':
      'Una breve trayectoria de roles centrados en IA, del más reciente al más antiguo.',

    // Contact
    'contact.eyebrow': 'Contacto',
    'contact.title': 'Construyamos algo',
    'contact.subtitle':
      'Abierto a roles de ingeniería de IA/LLM. La forma más rápida de contactarme es el correo.',
    'contact.email': 'Escríbeme',
    'contact.resume': 'Descargar CV (PDF)',
    'contact.github': 'GitHub',
    'contact.linkedin': 'LinkedIn',
    'contact.locationPrefix': 'Ubicado en ',
    'contact.location': 'Marbella, España',

    // Footer
    'footer.colophonSuffix': 'Hecho con Astro en Cloudflare.',
    'footer.backToTop': 'volver arriba',
    'footer.privacy': 'Privacidad',
    'footer.legal': 'Aviso legal',

    // Case study pages
    'caseStudy.back': '← Todos los proyectos',
    'caseStudy.viewCode': 'Ver código',
    'caseStudy.live': 'En vivo',
    'caseStudy.prev': '← Anterior',
    'caseStudy.next': 'Siguiente →',

    // 404
    'notFound.title': 'Perdido en el vacío',
    'notFound.msg': 'Esta página se salió de órbita. Vamos a devolverte al rumbo.',
    'notFound.home': 'Volver al inicio',
    'notFound.pageTitle': 'Página no encontrada',

    // Language toggle
    'lang.toggleLabel': 'Idioma',
    'lang.en': 'EN',
    'lang.es': 'ES',

    // SEO — home
    'seo.homeTitle': 'Sergio Cuéllar Almagro — Ingeniero de IA / LLM',
    'seo.homeDescription':
      'Ingeniero de IA/LLM especializado en sistemas agénticos y orquestación de LLM — LangChain/LangGraph, RAG con pgvector, sistemas multiagente y despliegues en producción. Base full-stack en Python, TypeScript, Node y React.',
  },
} satisfies Record<Locale, Record<string, string>>;

export type UIKey = keyof (typeof ui)['en'];
