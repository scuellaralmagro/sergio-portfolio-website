import { motion, useReducedMotion, type Variants } from 'framer-motion';

/**
 * ArchDiagram — reusable animated SVG architecture diagram.
 * Edges draw on (pathLength) and nodes stagger in once scrolled into view;
 * `prefers-reduced-motion` renders the final static state with no animation.
 *
 * Decorative: the SVG is aria-hidden — the surrounding <figcaption> carries the
 * text alternative (and keeps the diagram meaningful without JS / for SR users).
 * Used in the AI Showcase section and reused in project case studies.
 */
export type NodeKind = 'io' | 'agent' | 'tool' | 'store';

export interface DiagramNode {
  id: string;
  x: number;
  y: number;
  label: string;
  sub?: string;
  kind?: NodeKind;
}

export interface DiagramEdge {
  from: string;
  to: string;
}

interface Props {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  /** SVG coordinate space; the diagram scales responsively to its container. */
  viewWidth: number;
  viewHeight: number;
}

const NODE_W = 150;
const NODE_H = 54;

const STROKE: Record<NodeKind, string> = {
  io: 'var(--color-lavender-accent)',
  agent: 'var(--color-iris)',
  tool: 'var(--color-aurora)',
  store: 'var(--color-iris)',
};

const container: Variants = {
  hide: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const edgeV: Variants = {
  hide: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 0.65, transition: { duration: 0.6, ease: 'easeInOut' } },
};
const nodeV: Variants = {
  hide: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function ArchDiagram({ nodes, edges, viewWidth, viewHeight }: Props) {
  const reduce = useReducedMotion();
  const byId = new Map(nodes.map((n) => [n.id, n]));

  const edgePath = (e: DiagramEdge): string => {
    const a = byId.get(e.from);
    const b = byId.get(e.to);
    if (!a || !b) return '';
    const sx = a.x + NODE_W;
    const sy = a.y + NODE_H / 2;
    const tx = b.x;
    const ty = b.y + NODE_H / 2;
    const dx = Math.max(40, (tx - sx) / 2);
    return `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;
  };

  return (
    <motion.svg
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      width="100%"
      role="presentation"
      aria-hidden="true"
      style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
      variants={container}
      initial={reduce ? 'show' : 'hide'}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="7"
          markerHeight="7"
          refX="5.5"
          refY="3"
          orient="auto"
        >
          <path d="M0 0 L6 3 L0 6 z" fill="var(--color-lavender-accent)" />
        </marker>
      </defs>

      {edges.map((e, i) => (
        <motion.path
          key={`e-${i}`}
          d={edgePath(e)}
          fill="none"
          stroke="var(--color-lavender-accent)"
          strokeWidth={1.25}
          markerEnd="url(#arrowhead)"
          variants={edgeV}
        />
      ))}

      {nodes.map((n) => (
        <motion.g key={n.id} variants={nodeV}>
          <rect
            x={n.x}
            y={n.y}
            width={NODE_W}
            height={NODE_H}
            rx={12}
            fill="var(--color-midnight-surface)"
            stroke={STROKE[n.kind ?? 'agent']}
            strokeWidth={1}
          />
          <text
            x={n.x + NODE_W / 2}
            y={n.sub ? n.y + 23 : n.y + NODE_H / 2 + 4}
            textAnchor="middle"
            fill="var(--color-lilac-white)"
            style={{ font: '500 13px var(--font-inter-v)' }}
          >
            {n.label}
          </text>
          {n.sub && (
            <text
              x={n.x + NODE_W / 2}
              y={n.y + 39}
              textAnchor="middle"
              fill="var(--color-fog)"
              style={{ font: '400 10px var(--font-inter-v)' }}
            >
              {n.sub}
            </text>
          )}
        </motion.g>
      ))}
    </motion.svg>
  );
}
