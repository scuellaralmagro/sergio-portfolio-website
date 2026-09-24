import { motion, useReducedMotion } from 'framer-motion';
import type { ChatMessage, FailureStatus, SourceItem } from '@lib/askPortfolio/types';
import type { Status } from '@lib/askPortfolio/conversation';
import { splitIntoWords } from '@lib/askPortfolio/words';
import type { ConsoleStrings } from './i18n';
import Orb from '../Orb';

interface TranscriptProps {
  messages: ChatMessage[];
  status: Status;
  sources: SourceItem[];
  strings: ConsoleStrings;
}

function FadeText({ text, animate }: { text: string; animate: boolean }) {
  const words = splitIntoWords(text);
  return (
    <>
      {words.map((w, i) =>
        animate ? (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            {w}
          </motion.span>
        ) : (
          <span key={i}>{w}</span>
        ),
      )}
    </>
  );
}

export default function Transcript({ messages, status, sources, strings }: TranscriptProps) {
  const reduce = useReducedMotion();
  const streaming = status === 'streaming';
  const lastIndex = messages.length - 1;
  // Only the latest assistant turn carries the orb; it glides down turn to turn.
  const lastAssistant = messages.map((m) => m.role).lastIndexOf('assistant');
  const NOTICE: Record<FailureStatus, string> = {
    budget_exceeded: strings.noticeBudget,
    rate_limited: strings.noticeRate,
    error: strings.noticeError,
  };

  return (
    <ol className="transcript" role="log" aria-live="polite" aria-label="Conversation">
      {messages.map((m, i) => (
        <li key={i} className={`turn turn-${m.role}`}>
          {m.role === 'assistant' && (
            <span className="avatar">
              {i === lastAssistant && (
                <Orb
                  size="avatar"
                  phase={
                    m.failure
                      ? 'failed'
                      : streaming && i === lastIndex
                        ? m.content
                          ? 'composing'
                          : 'searching'
                        : 'done'
                  }
                  layoutId="assistant-orb"
                />
              )}
            </span>
          )}
          <div className="turn-body">
            {/* A failed turn with no tokens shows only its error bubble. */}
            {!(m.failure && !m.content) && (
              <p className="bubble">
                {m.role === 'assistant' ? (
                  <FadeText text={m.content} animate={!reduce} />
                ) : (
                  m.content
                )}
                {streaming && i === lastIndex && m.role === 'assistant' && (
                  <span className="caret" aria-hidden="true" />
                )}
              </p>
            )}
            {m.failure && (
              <p className="bubble bubble-error" role="status">
                {m.failure.message ?? NOTICE[m.failure.status]}
              </p>
            )}
          </div>
        </li>
      ))}

      {sources.length > 0 && (
        <li className="sources" aria-label={strings.sources}>
          <span className="sources-label">{strings.sources}</span>
          {sources.map((s, i) => (
            <span key={i} className="source-chip">
              {s.title}
            </span>
          ))}
        </li>
      )}
    </ol>
  );
}
