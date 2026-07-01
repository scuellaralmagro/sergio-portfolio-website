interface FiltersProps {
  q: string;
  from: string;
  to: string;
  onChange: (patch: { q?: string; from?: string; to?: string }) => void;
  onApply: () => void;
}

export default function Filters({ q, from, to, onChange, onApply }: FiltersProps) {
  return (
    <form
      className="vault-filters"
      onSubmit={(e) => {
        e.preventDefault();
        onApply();
      }}
    >
      <input
        type="search"
        className="vault-input"
        value={q}
        placeholder="Search transcripts…"
        onChange={(e) => onChange({ q: e.target.value })}
        aria-label="Search transcripts"
      />
      <label className="vault-field">
        From
        <input type="date" className="vault-input" value={from} onChange={(e) => onChange({ from: e.target.value })} />
      </label>
      <label className="vault-field">
        To
        <input type="date" className="vault-input" value={to} onChange={(e) => onChange({ to: e.target.value })} />
      </label>
      <button type="submit" className="vault-btn">Apply</button>
    </form>
  );
}
