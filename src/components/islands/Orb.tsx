import { motion } from 'framer-motion';
import { ThinkingOrb, type OrbState } from 'thinking-orbs';

/**
 * Where the assistant is in a turn:
 * - `idle`      — hero centerpiece before the first question;
 * - `searching` — question sent, no tokens yet (RAG retrieval);
 * - `composing` — the answer is streaming in;
 * - `done`      — a finished answer; the orb holds still.
 */
export type OrbPhase = 'idle' | 'searching' | 'composing' | 'done';

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
};

// thinking-orbs parses a literal color for its depth-shading ramp, so it can't
// take a CSS var — this mirrors --color-accent in theme.css.
const ACCENT = '#3ddc84';

/**
 * The OUTER span owns `layoutId` (the shared-layout morph from hero centerpiece
 * to avatar); the canvas inside is thinking-orbs, which handles its own
 * animation loop and reduced-motion fallback.
 */
export default function Orb({ size, phase, layoutId }: OrbProps) {
  const px = PX[size];

  return (
    <motion.span
      layoutId={layoutId}
      className={`orb orb-${size}`}
      aria-hidden="true"
      style={{ width: px, height: px }}
    >
      <ThinkingOrb
        state={STATE[phase]}
        size={TUNED[size]}
        theme="dark"
        color={ACCENT}
        paused={phase === 'done'}
        style={{ width: px, height: px }}
      />
    </motion.span>
  );
}
