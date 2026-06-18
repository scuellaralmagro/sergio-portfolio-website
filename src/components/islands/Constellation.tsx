import { useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

/**
 * Constellation — the Capability map. Each cluster is a hub with its skills as
 * "stars"; connectors draw on when scrolled into view, and hovering/focusing a
 * cluster highlights it while dimming the rest. `prefers-reduced-motion` renders
 * the final static state.
 *
 * Decorative — the SVG is aria-hidden; Expertise.astro renders a visually-hidden
 * list as the accessible text alternative.
 */
interface Cluster {
  name: string;
  skills: string[];
}
interface Props {
  clusters: Cluster[];
}

const COLS = 2;
const X0 = 90;
const Y0 = 86;
const DX = 372;
const DY = 240;
const HUB_W = 150;
const ROW = 26;

const svg: Variants = {
  hide: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};
const group: Variants = { hide: {}, show: { transition: { staggerChildren: 0.04 } } };
const lineV: Variants = {
  hide: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 0.5, transition: { duration: 0.5, ease: 'easeInOut' } },
};
const fadeV: Variants = {
  hide: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
};

export default function Constellation({ clusters }: Props) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  return (
    <motion.svg
      viewBox="0 0 760 440"
      width="100%"
      role="presentation"
      aria-hidden="true"
      style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
      variants={svg}
      initial={reduce ? 'show' : 'hide'}
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      {clusters.map((cluster, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const hx = X0 + col * DX;
        const hy = Y0 + row * DY;
        const hubRight = hx + HUB_W / 2;
        const n = cluster.skills.length;
        const dimmed = active !== null && active !== i;

        return (
          <motion.g
            key={cluster.name}
            variants={group}
            style={{ opacity: dimmed ? 0.3 : 1, transition: 'opacity 0.2s ease', cursor: 'pointer' }}
            tabIndex={0}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
          >
            {cluster.skills.map((skill, j) => {
              const dotX = hx + 110;
              const dotY = hy + (j - (n - 1) / 2) * ROW;
              const d = `M ${hubRight} ${hy} C ${hubRight + 24} ${hy}, ${dotX - 24} ${dotY}, ${dotX} ${dotY}`;
              return (
                <g key={skill}>
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="var(--color-lavender-accent)"
                    strokeWidth={1}
                    variants={lineV}
                  />
                  <motion.circle
                    cx={dotX}
                    cy={dotY}
                    r={3}
                    fill="var(--color-lavender-accent)"
                    variants={fadeV}
                  />
                  <motion.text
                    x={dotX + 10}
                    y={dotY + 4}
                    fill="var(--color-ash)"
                    style={{ font: '400 12px var(--font-inter-v)' }}
                    variants={fadeV}
                  >
                    {skill}
                  </motion.text>
                </g>
              );
            })}

            <motion.rect
              x={hx - HUB_W / 2}
              y={hy - 18}
              width={HUB_W}
              height={36}
              rx={18}
              fill="var(--color-midnight-surface)"
              stroke="var(--color-iris)"
              strokeWidth={1}
              variants={fadeV}
            />
            <motion.text
              x={hx}
              y={hy + 4}
              textAnchor="middle"
              fill="var(--color-lilac-white)"
              style={{ font: '500 13px var(--font-inter-v)' }}
              variants={fadeV}
            >
              {cluster.name}
            </motion.text>
          </motion.g>
        );
      })}
    </motion.svg>
  );
}
