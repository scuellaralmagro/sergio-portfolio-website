import type { ChatMessage, FailureStatus, SourceItem, SSEEvent } from './types';

export type Status = 'idle' | 'streaming' | FailureStatus;

export interface State {
  messages: ChatMessage[];
  status: Status;
  sources: SourceItem[];
}

export type Action =
  | { type: 'send'; text: string }
  | { type: 'event'; event: SSEEvent }
  | { type: 'streamError'; code: string; message?: string }
  | { type: 'reset' };

export const initialState: State = { messages: [], status: 'idle', sources: [] };

function statusForCode(code: string): FailureStatus {
  if (code === 'budget_exceeded') return 'budget_exceeded';
  if (code === 'rate_limited') return 'rate_limited';
  return 'error';
}

/** End the in-flight turn in error, marking its assistant message so the UI keeps it red. */
function fail(state: State, code: string, message?: string): State {
  const status = statusForCode(code);
  const messages = state.messages.slice();
  const last = messages[messages.length - 1];
  if (last && last.role === 'assistant') {
    messages[messages.length - 1] = { ...last, failure: { status, message } };
  }
  return { ...state, messages, status };
}

/**
 * The conversation as the API should see it: failed turns (the question and its
 * failed answer) dropped, and UI-only fields stripped.
 */
export function toHistory(messages: ChatMessage[]): ChatMessage[] {
  const history: ChatMessage[] = [];
  for (const m of messages) {
    if (m.failure) {
      if (history[history.length - 1]?.role === 'user') history.pop();
      continue;
    }
    history.push({ role: m.role, content: m.content });
  }
  return history;
}

function applyEvent(state: State, event: SSEEvent): State {
  switch (event.type) {
    case 'token': {
      const messages = state.messages.slice();
      const last = messages[messages.length - 1];
      if (last && last.role === 'assistant') {
        messages[messages.length - 1] = { ...last, content: last.content + event.text };
      }
      return { ...state, messages };
    }
    case 'sources':
      return { ...state, sources: event.items };
    case 'done':
      return { ...state, status: 'idle' };
    case 'error':
      return fail(state, event.code, event.message);
  }
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'send':
      return {
        ...state,
        status: 'streaming',
        sources: [],
        messages: [
          ...state.messages,
          { role: 'user', content: action.text },
          { role: 'assistant', content: '' },
        ],
      };
    case 'event':
      return applyEvent(state, action.event);
    case 'streamError':
      return fail(state, action.code, action.message);
    case 'reset':
      return initialState;
  }
}
