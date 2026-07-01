import type { RefObject } from 'react';

interface ComposerProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  streaming: boolean;
  canReset: boolean;
  onReset: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

export default function Composer({
  value,
  onChange,
  onSubmit,
  streaming,
  canReset,
  onReset,
  inputRef,
}: ComposerProps) {
  return (
    <div className="composer-row">
      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <label className="sr-only" htmlFor="ai-input">
          Ask a question about Sergio
        </label>
        <input
          id="ai-input"
          ref={inputRef}
          className="input"
          type="text"
          value={value}
          placeholder="Ask about Sergio…"
          autoComplete="off"
          disabled={streaming}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="submit"
          className="send"
          aria-label="Send"
          disabled={streaming || value.trim() === ''}
        >
          <span aria-hidden="true">{streaming ? '…' : '↑'}</span>
        </button>
      </form>
      {canReset && (
        <button type="button" className="reset" onClick={onReset} disabled={streaming}>
          New conversation
        </button>
      )}
    </div>
  );
}
