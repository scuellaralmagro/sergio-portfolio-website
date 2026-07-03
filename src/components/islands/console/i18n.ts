export type ConsoleLang = 'en' | 'es';

export interface ConsoleStrings {
  heroLabel: string;
  starters: [string, string, string];
  heroContactPre: string;
  inputLabel: string;
  inputPlaceholder: string;
  sendLabel: string;
  reset: string;
  sources: string;
  errorGeneric: string;
  noticeBudget: string;
  noticeRate: string;
  noticeError: string;
}

export const consoleUi: Record<ConsoleLang, ConsoleStrings> = {
  en: {
    heroLabel: 'Try asking',
    starters: [
      "What's Sergio's RAG experience?",
      'Tell me about the Kynetix project',
      'Is Sergio available for work?',
    ],
    heroContactPre: 'Prefer email? ',
    inputLabel: 'Ask a question about Sergio',
    inputPlaceholder: 'Ask about Sergio…',
    sendLabel: 'Send',
    reset: 'New conversation',
    sources: 'Sources',
    errorGeneric: 'Something went wrong. Please try again, or email info@sergiocuellar.dev.',
    noticeBudget:
      'This live demo has hit its daily limit. You can reach Sergio at info@sergiocuellar.dev.',
    noticeRate: "You're going a bit fast — try again in a moment.",
    noticeError: 'Something went wrong. Please try again, or email info@sergiocuellar.dev.',
  },
  es: {
    heroLabel: 'Prueba a preguntar',
    starters: [
      '¿Qué experiencia tiene Sergio con RAG?',
      'Háblame del proyecto Kynetix',
      '¿Está Sergio disponible para trabajar?',
    ],
    heroContactPre: '¿Prefieres el correo? ',
    inputLabel: 'Haz una pregunta sobre Sergio',
    inputPlaceholder: 'Pregunta sobre Sergio…',
    sendLabel: 'Enviar',
    reset: 'Nueva conversación',
    sources: 'Fuentes',
    errorGeneric: 'Algo ha ido mal. Inténtalo de nuevo o escribe a info@sergiocuellar.dev.',
    noticeBudget:
      'Esta demo en vivo ha alcanzado su límite diario. Puedes contactar con Sergio en info@sergiocuellar.dev.',
    noticeRate: 'Vas un poco rápido — inténtalo de nuevo en un momento.',
    noticeError: 'Algo ha ido mal. Inténtalo de nuevo o escribe a info@sergiocuellar.dev.',
  },
};
