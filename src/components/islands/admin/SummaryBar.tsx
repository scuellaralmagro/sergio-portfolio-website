import type { ConversationSummary } from '@lib/admin/types';

export default function SummaryBar({ summary }: { summary: ConversationSummary }) {
  const stats = [
    { label: 'Conversations', value: summary.totalConversations },
    { label: 'Total tokens', value: summary.totalTokens.toLocaleString() },
    { label: 'Today', value: summary.today },
  ];
  return (
    <div className="vault-summary">
      {stats.map((s) => (
        <div key={s.label} className="vault-stat">
          <span className="vault-stat-value">{s.value}</span>
          <span className="vault-stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
