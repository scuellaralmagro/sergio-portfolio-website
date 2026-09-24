import { describe, it, expect } from 'vitest';
import { reducer, initialState, toHistory, type State } from './conversation';

const streaming = (): State => reducer(initialState, { type: 'send', text: 'rag?' });

describe('conversation reducer', () => {
  it('send appends a user + empty assistant message and goes streaming', () => {
    const s = streaming();
    expect(s.status).toBe('streaming');
    expect(s.messages).toEqual([
      { role: 'user', content: 'rag?' },
      { role: 'assistant', content: '' },
    ]);
  });

  it('token events accumulate onto the in-flight assistant message', () => {
    let s = streaming();
    s = reducer(s, { type: 'event', event: { type: 'token', text: 'Sergio ' } });
    s = reducer(s, { type: 'event', event: { type: 'token', text: 'ships.' } });
    expect(s.messages[1]).toEqual({ role: 'assistant', content: 'Sergio ships.' });
  });

  it('sources sets sources; done returns to idle', () => {
    let s = streaming();
    s = reducer(s, {
      type: 'event',
      event: { type: 'sources', items: [{ title: 'Kynetix', ref: 'projects/kynetix' }] },
    });
    expect(s.sources).toEqual([{ title: 'Kynetix', ref: 'projects/kynetix' }]);
    s = reducer(s, { type: 'event', event: { type: 'done', usage: { input: 1, output: 2 } } });
    expect(s.status).toBe('idle');
  });

  it('error event maps budget_exceeded to its status', () => {
    let s = streaming();
    s = reducer(s, {
      type: 'event',
      event: { type: 'error', code: 'budget_exceeded', message: 'limit' },
    });
    expect(s.status).toBe('budget_exceeded');
    expect(s.messages[1].failure?.message).toBe('limit');
  });

  it('streamError maps rate_limited; reset clears', () => {
    let s = reducer(streaming(), {
      type: 'streamError',
      code: 'rate_limited',
      message: 'slow down',
    });
    expect(s.status).toBe('rate_limited');
    expect(reducer(s, { type: 'reset' })).toEqual(initialState);
  });

  it('error event marks the in-flight assistant turn as failed', () => {
    let s = streaming();
    s = reducer(s, { type: 'event', event: { type: 'token', text: 'Partial' } });
    s = reducer(s, {
      type: 'event',
      event: { type: 'error', code: 'server_error', message: 'boom' },
    });
    expect(s.messages[1]).toEqual({
      role: 'assistant',
      content: 'Partial',
      failure: { status: 'error', message: 'boom' },
    });
  });

  it('streamError marks the turn failed and it stays failed after the next send', () => {
    let s = reducer(streaming(), { type: 'streamError', code: 'rate_limited' });
    expect(s.messages[1].failure).toEqual({ status: 'rate_limited', message: undefined });
    s = reducer(s, { type: 'send', text: 'again?' });
    expect(s.status).toBe('streaming');
    expect(s.messages[1].failure?.status).toBe('rate_limited');
    expect(s.messages[3]).toEqual({ role: 'assistant', content: '' });
  });
});

describe('toHistory', () => {
  it('drops failed turns and strips UI-only fields', () => {
    let s = streaming();
    s = reducer(s, { type: 'event', event: { type: 'token', text: 'Sergio ships.' } });
    s = reducer(s, { type: 'event', event: { type: 'done', usage: { input: 1, output: 2 } } });
    s = reducer(s, { type: 'send', text: 'and agents?' });
    s = reducer(s, { type: 'streamError', code: 'server_error' });
    expect(toHistory(s.messages)).toEqual([
      { role: 'user', content: 'rag?' },
      { role: 'assistant', content: 'Sergio ships.' },
    ]);
  });
});
