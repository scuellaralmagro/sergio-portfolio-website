import { describe, it, expect, vi } from 'vitest';
import { streamChat } from './client';
import type { ChatMessage } from './types';

const messages: ChatMessage[] = [{ role: 'user', content: 'rag?' }];

function sseResponse(): Response {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      const enc = new TextEncoder();
      controller.enqueue(enc.encode('data: {"type":"token","text":"hi"}\n\n'));
      controller.enqueue(enc.encode('data: {"type":"done","usage":{"input":1,"output":1}}\n\n'));
      controller.close();
    },
  });
  return new Response(body, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
}

async function collect(gen: AsyncGenerator<unknown>) {
  const out = [];
  for await (const e of gen) out.push(e);
  return out;
}

describe('streamChat', () => {
  it('mints a token, posts the messages, and yields parsed events', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(sseResponse());
    const getToken = vi.fn().mockResolvedValue('tok');
    const events = await collect(
      streamChat({ messages, getToken, apiBaseUrl: 'https://api.test', fetchImpl }),
    );
    expect(getToken).toHaveBeenCalledOnce();
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://api.test/api/chat');
    expect(JSON.parse(init.body)).toEqual({ messages, turnstileToken: 'tok' });
    expect(events).toEqual([
      { type: 'token', text: 'hi' },
      { type: 'done', usage: { input: 1, output: 1 } },
    ]);
  });

  it('yields a turnstile error on 403', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('no', { status: 403 }));
    const events = await collect(
      streamChat({ messages, getToken: async () => 'tok', apiBaseUrl: 'https://api.test', fetchImpl }),
    );
    expect(events).toEqual([{ type: 'error', code: 'turnstile', message: expect.any(String) }]);
  });

  it('yields a rate_limited error on 429', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('slow', { status: 429 }));
    const events = await collect(
      streamChat({ messages, getToken: async () => 'tok', apiBaseUrl: 'https://api.test', fetchImpl }),
    );
    expect(events).toEqual([{ type: 'error', code: 'rate_limited', message: expect.any(String) }]);
  });
});
