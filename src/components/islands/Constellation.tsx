import { useEffect, useMemo, useRef, type CSSProperties } from 'react';

/**
 * Constellation — the Capability map as one connected network: a central core,
 * four cluster nodes branching off it, and each cluster's skills as satellite
 * stars. Nodes drift gently, light-pulses flow core → cluster → skill along the
 * spokes, stars twinkle (CSS), and hovering/focusing a cluster ignites its
 * branch while dimming the rest.
 *
 * Motion runs in one requestAnimationFrame loop writing SVG attributes directly
 * (no per-frame React renders); hover is handled with DOM classes for the same
 * reason. It pauses off-screen / when the tab is hidden, and renders a correct
 * static layout for SSR / no-JS / reduced motion. Decorative (aria-hidden) — the
 * accessible text alternative is the list rendered in Expertise.astro.
 */
interface Cluster {
  name: string;
  skills: string[];
}
interface Props {
  clusters: Cluster[];
}

const VIEW_W = 1000;
const VIEW_H = 700;
const CORE = { x: 500, y: 350 };
const BASES = [
  { x: 340, y: 215 },
  { x: 660, y: 215 },
  { x: 340, y: 485 },
  { x: 660, y: 485 },
];
const R = 96; // skill distance from its cluster
const SPREAD = 1.7; // fan angle (rad) on the outward side

function makeRand(seed: number) {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

interface SkillM {
  skill: string;
  ox: number;
  oy: number;
  r: number;
  base: number;
  twDelay: number;
  twDur: number;
  ax: number;
  ay: number;
  wx: number;
  wy: number;
  px: number;
  py: number;
  poff: number;
  anchor: 'start' | 'end';
  dx: number;
}
interface ClusterM {
  name: string;
  x: number;
  y: number;
  ax: number;
  ay: number;
  wx: number;
  wy: number;
  px: number;
  py: number;
  poff: number;
  nameDy: number;
  skills: SkillM[];
}
interface Model {
  core: { ax: number; ay: number; wx: number; wy: number; px: number; py: number };
  clusters: ClusterM[];
}

function buildModel(clusters: Cluster[]): Model {
  const rand = makeRand(20260619);
  const core = { ax: 2, ay: 2, wx: 0.5, wy: 0.42, px: rand() * 6.28, py: rand() * 6.28 };
  const out = clusters.map((cl, ci) => {
    const b = BASES[ci % 4];
    const theta = Math.atan2(b.y - CORE.y, b.x - CORE.x);
    const left = b.x < CORE.x;
    const top = b.y < CORE.y;
    const k = cl.skills.length;
    const skills: SkillM[] = cl.skills.map((skill, si) => {
      const delta = k > 1 ? (si / (k - 1) - 0.5) * SPREAD : 0;
      const ang = theta + delta;
      const bright = rand() > 0.6;
      return {
        skill,
        ox: R * Math.cos(ang),
        oy: R * Math.sin(ang),
        r: bright ? 3 : 2,
        base: bright ? 0.95 : 0.7,
        twDelay: +(rand() * 4).toFixed(2),
        twDur: +(rand() * 2.5 + 3.5).toFixed(2),
        ax: 3.5,
        ay: 3.5,
        wx: 0.5 + rand() * 0.4,
        wy: 0.5 + rand() * 0.4,
        px: rand() * 6.28,
        py: rand() * 6.28,
        poff: rand(),
        anchor: left ? 'end' : 'start',
        dx: left ? -9 : 9,
      };
    });
    return {
      name: cl.name,
      x: b.x,
      y: b.y,
      ax: 2.5,
      ay: 2.5,
      wx: 0.4,
      wy: 0.46,
      px: rand() * 6.28,
      py: rand() * 6.28,
      poff: rand(),
      nameDy: top ? 34 : -34,
      skills,
    };
  });
  return { core, clusters: out };
}

const drift = (b: number, a: number, w: number, p: number, t: number) => b + a * Math.sin(t * w + p);

export default function Constellation({ clusters }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const model = useMemo(() => buildModel(clusters), [clusters]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const coreGlow = root.querySelector<SVGCircleElement>('.core-glow');
    const coreStar = root.querySelector<SVGCircleElement>('.core-star');
    const groupEls = Array.from(root.querySelectorAll<SVGGElement>('.cl-group'));
    const groups = groupEls.map((g) => ({
      glow: g.querySelector<SVGCircleElement>('.cl-glow'),
      star: g.querySelector<SVGCircleElement>('.cl-star'),
      line: g.querySelector<SVGLineElement>('.cl-line'),
      name: g.querySelector<SVGTextElement>('.cl-name'),
      pulse: g.querySelector<SVGCircleElement>('.cl-pulse'),
      skills: Array.from(g.querySelectorAll<SVGGElement>('.sk-group')).map((s) => ({
        glow: s.querySelector<SVGCircleElement>('.sk-glow'),
        star: s.querySelector<SVGCircleElement>('.sk-star'),
        line: s.querySelector<SVGLineElement>('.sk-line'),
        label: s.querySelector<SVGTextElement>('.sk-label'),
        pulse: s.querySelector<SVGCircleElement>('.sk-pulse'),
      })),
    }));

    // Hover ignite — DOM classes only (no React re-render, so rAF positions hold).
    const enter = (i: number) =>
      groupEls.forEach((g, j) => {
        g.classList.toggle('is-dim', j !== i);
        g.classList.toggle('is-active', j === i);
      });
    const leave = () => groupEls.forEach((g) => g.classList.remove('is-dim', 'is-active'));
    const handlers = groupEls.map((g, i) => {
      const on = () => enter(i);
      g.addEventListener('mouseenter', on);
      g.addEventListener('focusin', on);
      g.addEventListener('mouseleave', leave);
      g.addEventListener('focusout', leave);
      return on;
    });

    let raf = 0;
    let running = false;
    let elapsed = 0;
    let prev = 0;

    const place = (el: Element | null, cx: number, cy: number) => {
      if (!el) return;
      el.setAttribute('cx', cx.toFixed(2));
      el.setAttribute('cy', cy.toFixed(2));
    };

    const tick = (now: number) => {
      elapsed += (now - prev) / 1000;
      prev = now;
      const t = elapsed;
      const cx = drift(CORE.x, model.core.ax, model.core.wx, model.core.px, t);
      const cy = drift(CORE.y, model.core.ay, model.core.wy, model.core.py, t);
      place(coreGlow, cx, cy);
      place(coreStar, cx, cy);

      model.clusters.forEach((cl, ci) => {
        const g = groups[ci];
        if (!g) return;
        const lx = drift(cl.x, cl.ax, cl.wx, cl.px, t);
        const ly = drift(cl.y, cl.ay, cl.wy, cl.py, t);
        place(g.glow, lx, ly);
        place(g.star, lx, ly);
        if (g.line) {
          g.line.setAttribute('x1', cx.toFixed(2));
          g.line.setAttribute('y1', cy.toFixed(2));
          g.line.setAttribute('x2', lx.toFixed(2));
          g.line.setAttribute('y2', ly.toFixed(2));
        }
        if (g.name) {
          g.name.setAttribute('x', lx.toFixed(2));
          g.name.setAttribute('y', (ly + cl.nameDy).toFixed(2));
        }
        if (g.pulse) {
          const p = (t * 0.4 + cl.poff) % 1;
          place(g.pulse, cx + (lx - cx) * p, cy + (ly - cy) * p);
          g.pulse.setAttribute('opacity', (0.5 * Math.sin(p * Math.PI)).toFixed(2));
        }

        cl.skills.forEach((sk, si) => {
          const s = g.skills[si];
          if (!s) return;
          const skx = lx + sk.ox + sk.ax * Math.sin(t * sk.wx + sk.px);
          const sky = ly + sk.oy + sk.ay * Math.sin(t * sk.wy + sk.py);
          place(s.glow, skx, sky);
          place(s.star, skx, sky);
          if (s.line) {
            s.line.setAttribute('x1', lx.toFixed(2));
            s.line.setAttribute('y1', ly.toFixed(2));
            s.line.setAttribute('x2', skx.toFixed(2));
            s.line.setAttribute('y2', sky.toFixed(2));
          }
          if (s.label) {
            s.label.setAttribute('x', (skx + sk.dx).toFixed(2));
            s.label.setAttribute('y', (sky + 3.5).toFixed(2));
          }
          if (s.pulse) {
            const p = (t * 0.5 + sk.poff) % 1;
            place(s.pulse, lx + (skx - lx) * p, ly + (sky - ly) * p);
            s.pulse.setAttribute('opacity', (0.5 * Math.sin(p * Math.PI)).toFixed(2));
          }
        });
      });
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      prev = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver((e) => (e[0]?.isIntersecting ? start() : stop()), {
      threshold: 0,
    });
    io.observe(root);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      groupEls.forEach((g, i) => {
        g.removeEventListener('mouseenter', handlers[i]);
        g.removeEventListener('focusin', handlers[i]);
        g.removeEventListener('mouseleave', leave);
        g.removeEventListener('focusout', leave);
      });
    };
  }, [model]);

  return (
    <div className="constellation-net" ref={rootRef}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        width="100%"
        role="presentation"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="cf-core-glow">
            <stop offset="0%" stopColor="var(--color-lavender-accent)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--color-lavender-accent)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cf-star-glow">
            <stop offset="0%" stopColor="var(--color-lavender-accent)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-lavender-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* spokes drawn first so nodes sit on top */}
        <circle className="core-glow" cx={CORE.x} cy={CORE.y} r={34} fill="url(#cf-core-glow)" />

        {model.clusters.map((cl) => {
          const lx = cl.x;
          const ly = cl.y;
          return (
            <g className="cl-group" key={cl.name} tabIndex={0}>
              <line
                className="cl-line"
                x1={CORE.x}
                y1={CORE.y}
                x2={lx}
                y2={ly}
                stroke="var(--color-lavender-accent)"
                strokeOpacity={0.2}
                strokeWidth={1.25}
              />
              <circle className="cl-pulse" cx={CORE.x} cy={CORE.y} r={2.4} fill="var(--color-lilac-white)" opacity={0} />

              {cl.skills.map((sk) => {
                const skx = lx + sk.ox;
                const sky = ly + sk.oy;
                return (
                  <g className="sk-group" key={sk.skill}>
                    <line
                      className="sk-line"
                      x1={lx}
                      y1={ly}
                      x2={skx}
                      y2={sky}
                      stroke="var(--color-lavender-accent)"
                      strokeOpacity={0.14}
                      strokeWidth={1}
                    />
                    <circle className="sk-pulse" cx={lx} cy={ly} r={1.8} fill="var(--color-lilac-white)" opacity={0} />
                    <circle className="sk-glow" cx={skx} cy={sky} r={sk.r * 2.6} fill="url(#cf-star-glow)" />
                    <circle
                      className="sk-star cf-twinkle"
                      cx={skx}
                      cy={sky}
                      r={sk.r}
                      fill="var(--color-lilac-white)"
                      style={
                        {
                          ['--base']: sk.base,
                          ['--delay']: `${sk.twDelay}s`,
                          ['--dur']: `${sk.twDur}s`,
                        } as CSSProperties
                      }
                    />
                    <text
                      className="sk-label"
                      x={skx + sk.dx}
                      y={sky + 3.5}
                      textAnchor={sk.anchor}
                    >
                      {sk.skill}
                    </text>
                  </g>
                );
              })}

              <circle className="cl-glow" cx={lx} cy={ly} r={20} fill="url(#cf-star-glow)" />
              <circle className="cl-star" cx={lx} cy={ly} r={4} fill="var(--color-lilac-white)" />
              <text className="cl-name" x={lx} y={ly + cl.nameDy} textAnchor="middle">
                {cl.name}
              </text>
            </g>
          );
        })}

        <circle className="core-star" cx={CORE.x} cy={CORE.y} r={5.5} fill="var(--color-lilac-white)" />
      </svg>
    </div>
  );
}
