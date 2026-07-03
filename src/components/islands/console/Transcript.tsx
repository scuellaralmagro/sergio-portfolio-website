import { motion, useReducedMotion } from 'framer-motion';
import type { ChatMessage, SourceItem } from '@lib/askPortfolio/types';
import type { Status } from '@lib/askPortfolio/conversation';
import { splitIntoWords } from '@lib/askPortfolio/words';
import type { ConsoleStrings } from './i18n';
import Orb from '../Orb';

interface TranscriptProps {
  messages: ChatMessage[];
  status: Status;
  sources: SourceItem[];
  errorMessage?: string;
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

export default function Transcript({
  messages,
  status,
  sources,
  errorMessage,
  strings,
}: TranscriptProps) {
  const reduce = useReducedMotion();
  const streaming = status === 'streaming';
  const lastIndex = messages.length - 1;
  const firstAssistant = messages.findIndex((m) => m.role === 'assistant');
  const NOTICE: Partial<Record<Status, string>> = {
    budget_exceeded: strings.noticeBudget,
    rate_limited: strings.noticeRate,
    error: strings.noticeError,
  };
  const notice = NOTICE[status];

  return (
    <ol className="transcript" role="log" aria-live="polite" aria-label="Conversation">
      {messages.map((m, i) => (
        <li key={i} className={`turn turn-${m.role}`}>
          {m.role === 'assistant' && (
            <span className="avatar">
              <Orb
                size="avatar"
                active={streaming && i === lastIndex}
                layoutId={i === firstAssistant ? 'assistant-orb' : undefined}
              />
            </span>
          )}
          <p className="bubble">
            {m.role === 'assistant' ? <FadeText text={m.content} animate={!reduce} /> : m.content}
            {streaming && i === lastIndex && m.role === 'assistant' && (
              <span className="caret" aria-hidden="true" />
            )}
          </p>
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

      {notice && (
        <li className="notice" role="status">
          {errorMessage ?? notice}
        </li>
      )}
    </ol>
  );
}
