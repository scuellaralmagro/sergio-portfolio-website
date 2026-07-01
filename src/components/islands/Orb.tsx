import { motion, useReducedMotion } from 'framer-motion';

interface OrbProps {
  size: 'hero' | 'avatar';
  active?: boolean;
  layoutId?: string;
}

const PX: Record<OrbProps['size'], number> = { hero: 88, avatar: 28 };

export default function Orb({ size, active = false, layoutId }: OrbProps) {
  const reduce = useReducedMotion();
  const px = PX[size];

  const animate = reduce
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
      animate={animate}
      transition={transition}
    />
  );
}
