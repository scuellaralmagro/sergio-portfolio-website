export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SourceItem {
  title: string;
  ref: string;
}

export type SSEEvent =
  | { type: 'token'; text: string }
  | { type: 'sources'; items: SourceItem[] }
  | { type: 'done'; usage: { input: number; output: number } }
  | { type: 'error'; code: string; message: string };
