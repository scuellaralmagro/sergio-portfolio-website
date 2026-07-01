import type { ChatMessage, SSEEvent } from './types';
import { streamToEvents } from './sse';

export interface StreamChatOptions {
  messages: ChatMessage[];
  sessionId: string;
  getToken: () => Promise<string>;
  apiBaseUrl: string;
  fetchImpl?: typeof fetch;
}

export async function* streamChat(opts: StreamChatOptions): AsyncGenerator<SSEEvent> {
  const { messages, sessionId, getToken, apiBaseUrl, fetchImpl = fetch } = opts;
  const turnstileToken = await getToken();
  const res = await fetchImpl(`${apiBaseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, turnstileToken, sessionId }),
  });
  if (res.status === 403) {
    yield { type: 'error', code: 'turnstile', message: "Couldn't verify you're human. Please try again." };
    return;
  }
  if (res.status === 429) {
    yield { type: 'error', code: 'rate_limited', message: "You're going a bit fast — try again in a moment." };
    return;
  }
  if (!res.ok || !res.body) {
    yield { type: 'error', code: 'server_error', message: 'Something went wrong. Please try again.' };
    return;
  }
  yield* streamToEvents(res.body);
}
