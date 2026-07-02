import { useState } from 'react';
import type { ConversationListItem, ConversationDetail } from '@lib/admin/types';
import { formatWhen, formatLocation, tokenTotal } from '@lib/admin/format';

interface ConversationListProps {
  items: ConversationListItem[];
  loadDetail: (id: number) => Promise<ConversationDetail>;
}

export default function ConversationList({ items, loadDetail }: ConversationListProps) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [detail, setDetail] = useState<ConversationDetail | null>(null);
  const [loading, setLoading] = useState(false);

  async function toggle(id: number) {
    if (openId === id) {
      setOpenId(null);
      setDetail(null);
      return;
    }
    setOpenId(id);
    setDetail(null);
    setLoading(true);
    try {
      setDetail(await loadDetail(id));
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) return <p className="vault-empty">No conversations found.</p>;

  return (
    <ul className="vault-list">
      {items.map((it) => (
        <li key={it.id} className={`vault-row${openId === it.id ? ' open' : ''}`}>
          <button type="button" className="vault-row-head" onClick={() => void toggle(it.id)}>
            <span className="vault-row-preview">{it.preview || '(no message)'}</span>
            <span className="vault-row-meta">
              {formatWhen(it.created_at)} · {formatLocation(it.country, it.city)}
              {it.ip_hash ? ` · IP ${it.ip_hash}` : ''} · {tokenTotal(it)} tok
            </span>
          </button>
          {openId === it.id && (
            <div className="vault-detail">
              {loading && <p className="vault-empty">Loading…</p>}
              {detail && (
                <>
                  {detail.messages.map((m, i) => (
                    <div key={i} className={`vault-msg vault-msg-${m.role}`}>
                      <span className="vault-msg-role">{m.role}</span>
                      <p className="vault-msg-content">{m.content}</p>
                    </div>
                  ))}
                  {detail.sources.length > 0 && (
                    <p className="vault-sources">
                      Sources: {detail.sources.map((s) => s.title).join(', ')}
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
