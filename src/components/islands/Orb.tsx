import { motion, useReducedMotion } from 'framer-motion';

interface OrbProps {
  size: 'hero' | 'avatar';
  active?: boolean;
  layoutId?: string;
}

const PX: Record<OrbProps['size'], number> = { hero: 88, avatar: 28 };

/**
 * The orb decouples two animations onto two elements so they don't fight:
 * - the OUTER span owns `layoutId` (the shared-layout morph from hero centerpiece to avatar);
 * - the INNER `.orb-core` owns the breathing scale/opacity pulse.
 * Putting both a layout morph and an infinite scale keyframe on one element makes framer's
 * layout transform loop against the keyframe transform.
 */
export default function Orb({ size, active = false, layoutId }: OrbProps) {
  const reduce = useReducedMotion();
  const px = PX[size];

  const breathe = reduce
    ? undefined
    : active
      ? { scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }
      : { scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] };

  const transition = reduce
    ? undefined
    : { duration: active ? 1.6 : 4, ease: 'easeInOut' as const, repeat: Infinity };

  return (
    <motion.span
      layoutId={layoutId}
      className={`orb orb-${size}${active ? ' orb-active' : ''}`}
      aria-hidden="true"
      style={{ width: px, height: px }}
    >
      <motion.span className="orb-core" animate={breathe} transition={transition} />
    </motion.span>
  );
}
