'use client';

import { useScrollProgress } from '@/hooks/useScrollProgress';
import { SKILLS } from '@/lib/constants';

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'FRONTEND',
  backend: 'BACKEND',
  mobile: 'MOBILE',
  tools: 'TOOLS',
};

// Tiny cube-shaped bullet icon — echoes the main cube as a micro element.
function CubeBullet() {
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'relative',
        width: 10,
        height: 10,
        display: 'inline-block',
        marginRight: 12,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          inset: 0,
          border: '1px solid rgba(255,255,255,0.5)',
          background: 'rgba(255,255,255,0.05)',
          transform: 'rotate(45deg)',
        }}
      />
    </span>
  );
}

// Same ease as the cube spline so text + cube read as one motion.
function smoothstep(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

// Stack scroll choreography (matches cube spline + chapter ranges):
//   0.00 → 0.13   ENTER  the moment the user scrolls, the cube starts
//                          sweeping from its hero-right slot to the
//                          stack-left slot, AND the text slides in from
//                          the LEFT toward its right-column position.
//                          Cube + text are counter-travelling — they
//                          cross the viewport mid-sweep so the handoff
//                          reads as one exchange.
//   0.13 → 0.27   DWELL  cube on left + all skill columns on the right
//                          visible together in one frame.
//   0.27 → 0.30   EXIT   text slides off to the RIGHT as the cube
//                          swings toward Work on the right.
const ENTER_START = 0.00;
const ENTER_END = 0.13;
const EXIT_START = 0.27;
const EXIT_END = 0.30;

// Tight per-element stagger — all rows arrive in roughly the same frame
// so the user sees a single "everything is here" snap, not a slow cascade.
const STAGGER_STEP = 0.004;

export default function Stack() {
  const progress = useScrollProgress();

  const exitP = smoothstep((progress - EXIT_START) / (EXIT_END - EXIT_START));

  const rowProgress = (i: number) => {
    const stagger = i * STAGGER_STEP;
    const inP = smoothstep(
      (progress - (ENTER_START + stagger)) / (ENTER_END - ENTER_START)
    );
    return inP * (1 - exitP);
  };

  // Slide direction: ENTER from the LEFT (−X), EXIT to the RIGHT (+X).
  // Text counter-travels against the cube: as the cube crosses the
  // viewport from its hero-right slot to the stack-left slot, the text
  // slides in from the left and settles on the right column.
  const rowStyle = (i: number): React.CSSProperties => {
    const p = rowProgress(i);
    const enterTx = (1 - p) * -160;      // when entering: shifted LEFT
    const exitTx = exitP * 160;          // when exiting: shifted RIGHT
    return {
      opacity: p,
      transform: `translateX(${enterTx + exitTx}px)`,
      willChange: 'transform, opacity',
    };
  };

  return (
    <section
      id="stack"
      className="relative"
      style={{
        // Tall scroll wrapper — 220vh of scroll → ~24% of total page height
        // → matches the 0.10 → 0.34 chapter range the cube spline targets.
        height: '220vh',
      }}
    >
      {/* Sticky inner — pinned to viewport top for the entire scroll range.
          Everything inside lives in a single 100vh frame, so the heading,
          description, and full skills grid are all visible together at
          DWELL — the user never sees a Stack frame with the heading
          scrolled offscreen. */}
      <div
        className="sticky top-0 px-6 md:px-10 lg:px-16"
        style={{
          height: '100vh',
          maxWidth: 1440,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          {/* LEFT — reserved cube zone (cube is fixed-positioned over it). */}
          <div
            aria-hidden="true"
            className="hidden lg:block lg:col-span-5"
            style={{ minHeight: 480 }}
          />

          {/* RIGHT — scroll-synced text column. Slides in from the right
              while the cube slides to the left — one continuous motion. */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Numbered label */}
            <div
              className="flex items-center gap-3"
              style={{ marginBottom: 24, ...rowStyle(0) }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.35em',
                  color: '#4A4A4A',
                }}
              >
                /02
              </span>
              <span
                style={{
                  width: 24,
                  height: 1,
                  background: '#4A4A4A',
                  display: 'inline-block',
                }}
              />
              <span
                className="font-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.35em',
                  color: '#7A7A7A',
                }}
              >
                THE STACK
              </span>
            </div>

            {/* Kicker */}
            <div
              className="font-mono"
              style={{
                fontSize: 11,
                letterSpacing: '0.3em',
                color: '#7A7A7A',
                textTransform: 'uppercase',
                marginBottom: 14,
                ...rowStyle(1),
              }}
            >
              Built across <span style={{ color: '#4A9EFF' }}>four</span> disciplines
            </div>

            {/* Heading */}
            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(34px, 4.4vw, 64px)',
                fontWeight: 500,
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
                color: '#F5F5F5',
                ...rowStyle(2),
              }}
            >
              Tools I build
              <br />
              with.
            </h2>

            {/* Description */}
            <p
              className="font-sans"
              style={{
                fontSize: 15,
                lineHeight: 1.6,
                color: '#9A9A9A',
                marginTop: 18,
                maxWidth: 480,
                ...rowStyle(3),
              }}
            >
              15+ technologies across frontend, backend, mobile, and tooling.
              Always picking the right tool for the job.
            </p>

            {/* Skills grid — 2x2 grid, all four columns visible together
                in the dwell frame. */}
            <div
              className="grid grid-cols-2 gap-x-10 gap-y-6"
              style={{ marginTop: 30 }}
            >
              {Object.entries(SKILLS).map(([category, skills], catIdx) => (
                <div key={category} style={rowStyle(4 + catIdx)}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 10,
                      paddingBottom: 8,
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <span
                      className="font-mono"
                      style={{
                        fontSize: 10,
                        letterSpacing: '0.28em',
                        color: '#7A7A7A',
                        fontWeight: 500,
                      }}
                    >
                      {CATEGORY_LABELS[category] || category.toUpperCase()}
                    </span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {skills.map((skill) => (
                      <li
                        key={skill}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: 6,
                          fontSize: 14,
                          color: '#C5C5C5',
                          fontFamily: 'var(--font-inter), sans-serif',
                        }}
                      >
                        <CubeBullet />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
