export type FailureStatus = 'error' | 'budget_exceeded' | 'rate_limited';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  /** UI-only: set on an assistant turn that errored. Never sent to the API (see toHistory). */
  failure?: { status: FailureStatus; message?: string };
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
