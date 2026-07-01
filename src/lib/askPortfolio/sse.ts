import type { SSEEvent } from './types';

export function createSSEParser(): { push(chunk: string): SSEEvent[] } {
  let buffer = '';
  return {
    push(chunk: string): SSEEvent[] {
      buffer += chunk;
      const events: SSEEvent[] = [];
      const frames = buffer.split('\n\n');
      buffer = frames.pop() ?? '';
      for (const frame of frames) {
        const line = frame.trim();
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (!data || data === '[DONE]') continue;
        try {
          events.push(JSON.parse(data) as SSEEvent);
        } catch {
          // ignore malformed frame
        }
      }
      return events;
    },
  };
}

export async function* streamToEvents(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<SSEEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  const parser = createSSEParser();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const event of parser.push(decoder.decode(value, { stream: true }))) {
      yield event;
    }
  }
}
