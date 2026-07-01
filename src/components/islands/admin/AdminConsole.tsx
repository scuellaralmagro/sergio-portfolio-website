import { useEffect, useState } from 'react';
import { site } from '@data/site';
import { fetchConversations, fetchConversation, AdminAuthError } from '@lib/admin/client';
import type { ConversationsResponse } from '@lib/admin/types';
import KeyGate from './KeyGate';
import SummaryBar from './SummaryBar';
import Filters from './Filters';
import ConversationList from './ConversationList';

const STORAGE_KEY = 'vault_key';

export default function AdminConsole() {
  const [key, setKey] = useState<string | null>(null);
  const [gateError, setGateError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState<ConversationsResponse | null>(null);
  const [loadError, setLoadError] = useState<string | undefined>();
  const [filters, setFilters] = useState({ q: '', from: '', to: '' });

  // Restore a previously entered key (this browser session only).
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) setKey(saved);
  }, []);

  async function load(activeKey: string, f = filters) {
    setLoadError(undefined);
    try {
      const res = await fetchConversations({
        apiBaseUrl: site.apiBaseUrl,
        key: activeKey,
        q: f.q || undefined,
        from: f.from || undefined,
        to: f.to || undefined,
      });
      setData(res);
    } catch (err) {
      if (err instanceof AdminAuthError) throw err;
      setLoadError('Could not load conversations. Try again.');
    }
  }

  // Load whenever we have a key.
  useEffect(() => {
    if (!key) return;
    void (async () => {
      try {
        await load(key);
      } catch {
        // key rejected after the fact — drop it and re-prompt
        sessionStorage.removeItem(STORAGE_KEY);
        setKey(null);
        setGateError('That key was rejected.');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  async function submitKey(candidate: string) {
    setBusy(true);
    setGateError(undefined);
    try {
      await fetchConversations({ apiBaseUrl: site.apiBaseUrl, key: candidate, limit: 1 });
      sessionStorage.setItem(STORAGE_KEY, candidate);
      setKey(candidate);
    } catch (err) {
      setGateError(err instanceof AdminAuthError ? 'Invalid key.' : 'Could not reach the server.');
    } finally {
      setBusy(false);
    }
  }

  if (!key) return <KeyGate onSubmit={submitKey} error={gateError} busy={busy} />;

  return (
    <div className="vault">
      <header className="vault-header">
        <h1 className="vault-title">Conversation Vault</h1>
        <button
          type="button"
          className="vault-btn ghost"
          onClick={() => {
            sessionStorage.removeItem(STORAGE_KEY);
            setKey(null);
            setData(null);
          }}
        >
          Lock
        </button>
      </header>
      {data && <SummaryBar summary={data.summary} />}
      <Filters
        q={filters.q}
        from={filters.from}
        to={filters.to}
        onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
        onApply={() => void load(key)}
      />
      {loadError && <p className="vault-error">{loadError}</p>}
      {data && (
        <ConversationList
          items={data.items}
          loadDetail={(id) => fetchConversation({ apiBaseUrl: site.apiBaseUrl, key, id })}
        />
      )}
    </div>
  );
}
