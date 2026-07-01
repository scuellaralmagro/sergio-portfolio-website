import { describe, it, expect } from 'vitest';
import { buildQuery, fetchConversations, fetchConversation, AdminAuthError } from './client';

describe('admin client', () => {
  it('buildQuery serializes only present params', () => {
    expect(buildQuery({ limit: 50, offset: 0 })).toBe('?limit=50&offset=0');
    expect(buildQuery({ q: 'rag' })).toBe('?q=rag');
    expect(buildQuery({})).toBe('');
  });

  it('fetchConversations sends the bearer key and returns JSON', async () => {
    let authHeader: string | null = null;
    const fetchImpl = (async (_url: string, init: RequestInit) => {
      authHeader = new Headers(init.headers).get('Authorization');
      return new Response(JSON.stringify({ items: [], summary: { totalConversations: 0, totalTokens: 0, today: 0 } }), { status: 200 });
    }) as unknown as typeof fetch;
    const out = await fetchConversations({ apiBaseUrl: 'https://api.example', key: 'k', fetchImpl });
    expect(authHeader).toBe('Bearer k');
    expect(out.summary.totalConversations).toBe(0);
  });

  it('throws AdminAuthError on 401', async () => {
    const fetchImpl = (async () => new Response('no', { status: 401 })) as unknown as typeof fetch;
    await expect(fetchConversation({ apiBaseUrl: 'https://api.example', key: 'bad', id: 1, fetchImpl }))
      .rejects.toBeInstanceOf(AdminAuthError);
  });
});
