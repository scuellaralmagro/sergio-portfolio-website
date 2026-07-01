import { useReducer, useRef, useState } from 'react';
import { reducer, initialState, type Status } from '@lib/askPortfolio/conversation';
import { streamChat } from '@lib/askPortfolio/client';
import { site } from '@data/site';
import { useTurnstile } from './useTurnstile';

const SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;

const STARTERS = [
  "What's Sergio's RAG experience?",
  'Tell me about the Kynetix project',
  'Is Sergio available for work?',
];

const STATUS_BANNER: Partial<Record<Status, string>> = {
  budget_exceeded:
    'This live demo has hit its daily limit. You can reach Sergio at info@sergiocuellar.dev.',
  rate_limited: "You're going a bit fast — try again in a moment.",
  error: 'Something went wrong. Please try again, or email info@sergiocuellar.dev.',
};

export default function AIConsole() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [input, setInput] = useState('');
  const { containerRef, getToken } = useTurnstile(SITE_KEY);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const streaming = state.status === 'streaming';

  async function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    const history = [...state.messages, { role: 'user' as const, content: trimmed }];
    dispatch({ type: 'send', text: trimmed });
    setInput('');
    try {
      for await (const event of streamChat({
        messages: history,
        getToken,
        apiBaseUrl: site.apiBaseUrl,
      })) {
        dispatch({ type: 'event', event });
      }
    } catch {
      dispatch({ type: 'streamError', code: 'server_error', message: STATUS_BANNER.error });
    } finally {
      inputRef.current?.focus();
    }
  }

  const banner = STATUS_BANNER[state.status];

  return (
    <div className="ai-console">
      {state.messages.length === 0 ? (
        <div className="intro">
          <p className="intro-lead">
            Ask this assistant anything about Sergio — his experience, projects, or stack. Prefer
            email? <a href="mailto:info@sergiocuellar.dev">info@sergiocuellar.dev</a>.
          </p>
          <ul className="starters">
            {STARTERS.map((q) => (
              <li key={q}>
                <button type="button" className="starter" onClick={() => void ask(q)}>
                  {q}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ol className="transcript" aria-live="polite" aria-label="Conversation">
          {state.messages.map((m, i) => (
            <li key={i} className={`turn turn-${m.role}`}>
              <span className="role">{m.role === 'user' ? 'You' : 'Assistant'}</span>
              <p className="bubble">
                {m.content}
                {streaming && i === state.messages.length - 1 && m.role === 'assistant' && (
                  <span className="caret" aria-hidden="true" />
                )}
              </p>
            </li>
          ))}
          {state.sources.length > 0 && (
            <li className="sources" aria-label="Sources">
              <span className="sources-label">Sources</span>
              {state.sources.map((s, i) => (
                <span key={i} className="source-chip">
                  {s.title}
                </span>
              ))}
            </li>
          )}
        </ol>
      )}

      {banner && (
        <p className="banner" role="status">
          {banner}
        </p>
      )}

      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          void ask(input);
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
          value={input}
          placeholder="Ask about Sergio…"
          autoComplete="off"
          disabled={streaming}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="send" disabled={streaming || input.trim() === ''}>
          {streaming ? 'Thinking…' : 'Ask'}
        </button>
        {state.messages.length > 0 && (
          <button
            type="button"
            className="clear"
            onClick={() => dispatch({ type: 'reset' })}
            disabled={streaming}
          >
            Clear
          </button>
        )}
      </form>

      <div ref={containerRef} className="turnstile-host" />
    </div>
  );
}
