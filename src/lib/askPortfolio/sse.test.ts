import { describe, it, expect } from 'vitest';
import { createSSEParser, streamToEvents } from './sse';

describe('createSSEParser', () => {
  it('parses a single complete frame', () => {
    const p = createSSEParser();
    expect(p.push('data: {"type":"token","text":"hi"}\n\n')).toEqual([
      { type: 'token', text: 'hi' },
    ]);
  });

  it('buffers a frame split across two chunks', () => {
    const p = createSSEParser();
    expect(p.push('data: {"type":"to')).toEqual([]);
    expect(p.push('ken","text":"hi"}\n\n')).toEqual([{ type: 'token', text: 'hi' }]);
  });

  it('parses multiple frames in one chunk', () => {
    const p = createSSEParser();
    const out = p.push(
      'data: {"type":"token","text":"a"}\n\ndata: {"type":"token","text":"b"}\n\n',
    );
    expect(out).toEqual([
      { type: 'token', text: 'a' },
      { type: 'token', text: 'b' },
    ]);
  });

  it('parses sources, done and error events', () => {
    const p = createSSEParser();
    expect(
      p.push('data: {"type":"sources","items":[{"title":"Kynetix","ref":"projects/kynetix"}]}\n\n'),
    ).toEqual([{ type: 'sources', items: [{ title: 'Kynetix', ref: 'projects/kynetix' }] }]);
    expect(p.push('data: {"type":"done","usage":{"input":10,"output":5}}\n\n')).toEqual([
      { type: 'done', usage: { input: 10, output: 5 } },
    ]);
    expect(p.push('data: {"type":"error","code":"budget_exceeded","message":"limit"}\n\n')).toEqual([
      { type: 'error', code: 'budget_exceeded', message: 'limit' },
    ]);
  });

  it('ignores malformed or empty frames', () => {
    const p = createSSEParser();
    expect(p.push('data: not-json\n\n')).toEqual([]);
    expect(p.push('data: \n\n')).toEqual([]);
    expect(p.push(': comment\n\n')).toEqual([]);
  });
});

describe('streamToEvents', () => {
  it('yields events parsed from a byte stream', async () => {
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        const enc = new TextEncoder();
        controller.enqueue(enc.encode('data: {"type":"token","text":"Sergio "}\n\n'));
        controller.enqueue(enc.encode('data: {"type":"token","text":"ships."}\n\n'));
        controller.enqueue(enc.encode('data: {"type":"done","usage":{"input":1,"output":2}}\n\n'));
        controller.close();
      },
    });
    const events = [];
    for await (const e of streamToEvents(body)) events.push(e);
    expect(events).toEqual([
      { type: 'token', text: 'Sergio ' },
      { type: 'token', text: 'ships.' },
      { type: 'done', usage: { input: 1, output: 2 } },
    ]);
  });
});
