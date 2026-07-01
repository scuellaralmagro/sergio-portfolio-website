import type { ConversationsResponse, ConversationDetail } from './types';

export class AdminAuthError extends Error {}

export interface AdminBase {
  apiBaseUrl: string;
  key: string;
  fetchImpl?: typeof fetch;
}
export interface ListArgs extends AdminBase {
  q?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}

export function buildQuery(a: { q?: string; from?: string; to?: string; limit?: number; offset?: number }): string {
  const sp = new URLSearchParams();
  if (a.q) sp.set('q', a.q);
  if (a.from) sp.set('from', a.from);
  if (a.to) sp.set('to', a.to);
  if (a.limit != null) sp.set('limit', String(a.limit));
  if (a.offset != null) sp.set('offset', String(a.offset));
  const s = sp.toString();
  return s ? `?${s}` : '';
}

async function authedGet(url: string, key: string, fetchImpl: typeof fetch): Promise<Response> {
  const res = await fetchImpl(url, { headers: { Authorization: `Bearer ${key}` } });
  if (res.status === 401) throw new AdminAuthError('unauthorized');
  if (!res.ok) throw new Error(`request failed: ${res.status}`);
  return res;
}

export async function fetchConversations(a: ListArgs): Promise<ConversationsResponse> {
  const { apiBaseUrl, key, fetchImpl = fetch } = a;
  const res = await authedGet(`${apiBaseUrl}/api/admin/conversations${buildQuery(a)}`, key, fetchImpl);
  return (await res.json()) as ConversationsResponse;
}

export async function fetchConversation(a: AdminBase & { id: number }): Promise<ConversationDetail> {
  const { apiBaseUrl, key, id, fetchImpl = fetch } = a;
  const res = await authedGet(`${apiBaseUrl}/api/admin/conversations/${id}`, key, fetchImpl);
  return (await res.json()) as ConversationDetail;
}
