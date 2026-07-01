import type { ChatMessage, SourceItem, SSEEvent } from './types';

export type Status = 'idle' | 'streaming' | 'error' | 'budget_exceeded' | 'rate_limited';

export interface State {
  messages: ChatMessage[];
  status: Status;
  sources: SourceItem[];
  errorMessage?: string;
}

export type Action =
  | { type: 'send'; text: string }
  | { type: 'event'; event: SSEEvent }
  | { type: 'streamError'; code: string; message?: string }
  | { type: 'reset' };

export const initialState: State = { messages: [], status: 'idle', sources: [] };

function statusForCode(code: string): Status {
  if (code === 'budget_exceeded') return 'budget_exceeded';
  if (code === 'rate_limited') return 'rate_limited';
  return 'error';
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
      return { ...state, status: statusForCode(event.code), errorMessage: event.message };
  }
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'send':
      return {
        ...state,
        status: 'streaming',
        sources: [],
        errorMessage: undefined,
        messages: [
          ...state.messages,
          { role: 'user', content: action.text },
          { role: 'assistant', content: '' },
        ],
      };
    case 'event':
      return applyEvent(state, action.event);
    case 'streamError':
      return { ...state, status: statusForCode(action.code), errorMessage: action.message };
    case 'reset':
      return initialState;
  }
}
