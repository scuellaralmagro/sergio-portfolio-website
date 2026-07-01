import { useState } from 'react';

interface KeyGateProps {
  onSubmit: (key: string) => void;
  error?: string;
  busy?: boolean;
}

export default function KeyGate({ onSubmit, error, busy }: KeyGateProps) {
  const [value, setValue] = useState('');
  return (
    <form
      className="vault-gate"
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSubmit(value.trim());
      }}
    >
      <h1 className="vault-gate-title">Conversation Vault</h1>
      <p className="vault-gate-hint">Enter your access key.</p>
      <input
        type="password"
        className="vault-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Access key"
        autoFocus
        aria-label="Access key"
      />
      {error && <p className="vault-error">{error}</p>}
      <button type="submit" className="vault-btn" disabled={busy}>
        {busy ? 'Checking…' : 'Enter'}
      </button>
    </form>
  );
}
