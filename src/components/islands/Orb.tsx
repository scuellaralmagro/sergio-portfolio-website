import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ThinkingOrb, type OrbState } from 'thinking-orbs';

/**
 * Where the assistant is in a turn:
 * - `idle`      — hero centerpiece before the first question;
 * - `searching` — question sent, no tokens yet (RAG retrieval);
 * - `composing` — the answer is streaming in;
 * - `done`      — a finished answer; the orb keeps a slow, calm breath;
 * - `failed`    — the turn errored; the orb turns red and keeps solving.
 */
export type OrbPhase = 'idle' | 'searching' | 'composing' | 'done' | 'failed';

interface OrbProps {
  size: 'hero' | 'avatar';
  phase: OrbPhase;
  layoutId?: string;
}

/** Rendered CSS px. The hero upscales the library's tuned 64px canvas. */
const PX: Record<OrbProps['size'], number> = { hero: 88, avatar: 32 };
const TUNED: Record<OrbProps['size'], 64 | 32> = { hero: 64, avatar: 32 };

const STATE: Record<OrbPhase, OrbState> = {
  idle: 'connecting',
  searching: 'searching',
  composing: 'composing',
  done: 'breathing',
  failed: 'solving',
};

// thinking-orbs parses a literal color for its depth-shading ramp, so it can't
// take a CSS var — these mirror --color-accent and --color-danger in theme.css.
const ACCENT = '#3ddc84';
const DANGER = '#f87171';

/**
 * The OUTER span owns `layoutId` (the shared-layout morph from hero centerpiece
 * to avatar); inside it, each phase's thinking-orbs canvas crossfades into the
 * next, so a switch of animation or tint (e.g. red on failure) never jumps.
 */
export default function Orb({ size, phase, layoutId }: OrbProps) {
  const reduce = useReducedMotion();
  const px = PX[size];

  return (
    <motion.span
      layoutId={layoutId}
      className={`orb orb-${size}`}
      aria-hidden="true"
      style={{ width: px, height: px }}
    >
      <AnimatePresence initial={false}>
        <motion.span
          key={phase}
          className="orb-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.3 }}
        >
          <ThinkingOrb
            state={STATE[phase]}
            size={TUNED[size]}
            theme="dark"
            color={phase === 'failed' ? DANGER : ACCENT}
            speed={phase === 'done' ? 0.5 : 1}
            style={{ width: px, height: px }}
          />
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
