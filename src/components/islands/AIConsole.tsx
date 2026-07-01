import { useReducer, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { reducer, initialState } from '@lib/askPortfolio/conversation';
import { streamChat } from '@lib/askPortfolio/client';
import { site } from '@data/site';
import { useTurnstile } from './useTurnstile';
import HeroIdle from './console/HeroIdle';
import Transcript from './console/Transcript';
import Composer from './console/Composer';

const SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;

const STARTERS = [
  "What's Sergio's RAG experience?",
  'Tell me about the Kynetix project',
  'Is Sergio available for work?',
];

export default function AIConsole() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [input, setInput] = useState('');
  const { containerRef, getToken } = useTurnstile(SITE_KEY);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const reduce = useReducedMotion();
  const streaming = state.status === 'streaming';
  const started = state.messages.length > 0;

  async function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    const history = [...state.messages, { role: 'user' as const, content: trimmed }];
    dispatch({ type: 'send', text: trimmed });
    setInput('');
    try {
      for await (const event of streamChat({
        messages: history,
        sessionId: sessionIdRef.current,
        getToken,
        apiBaseUrl: site.apiBaseUrl,
      })) {
        dispatch({ type: 'event', event });
      }
    } catch {
      dispatch({
        type: 'streamError',
        code: 'server_error',
        message: 'Something went wrong. Please try again, or email info@sergiocuellar.dev.',
      });
    } finally {
      inputRef.current?.focus();
    }
  }

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.25 },
      };

  return (
    <div className={`ai-console${started ? ' started' : ''}`}>
      <LayoutGroup>
        <div className="console-stage">
          <AnimatePresence mode="popLayout" initial={false}>
            {started ? (
              <motion.div key="chat" className="stage-pane" {...fade}>
                <Transcript
                  messages={state.messages}
                  status={state.status}
                  sources={state.sources}
                  errorMessage={state.errorMessage}
                />
              </motion.div>
            ) : (
              <motion.div key="hero" className="stage-pane" {...fade}>
                <HeroIdle starters={STARTERS} onPick={(q) => void ask(q)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Composer
          value={input}
          onChange={setInput}
          onSubmit={() => void ask(input)}
          streaming={streaming}
          canReset={started}
          onReset={() => {
            sessionIdRef.current = crypto.randomUUID();
            dispatch({ type: 'reset' });
          }}
          inputRef={inputRef}
        />
      </LayoutGroup>

      <div ref={containerRef} className="turnstile-host" />
    </div>
  );
}
