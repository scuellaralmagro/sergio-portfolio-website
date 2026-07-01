import { describe, it, expect } from 'vitest';
import { reducer, initialState, type State } from './conversation';

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
    expect(s.errorMessage).toBe('limit');
  });

  it('streamError maps rate_limited; reset clears', () => {
    let s = reducer(streaming(), { type: 'streamError', code: 'rate_limited', message: 'slow down' });
    expect(s.status).toBe('rate_limited');
    expect(reducer(s, { type: 'reset' })).toEqual(initialState);
  });
});
