'use client';

import { useScrollProgress } from '@/hooks/useScrollProgress';
import { ACHIEVEMENTS, EDUCATION } from '@/lib/constants';

// Real journey — applied → accepted → finals. No invented milestones.
const JOURNEY_STEPS = [
  { label: 'APPLIED', color: '#7A7A7A' },
  { label: 'ACCEPTED', color: '#62D66E' },
  { label: 'FINALS', color: '#C9A84C' },
];

function smoothstep(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

// Arena scroll choreography (cube spline + chapter range 0.61 – 0.80):
//   0.61 → 0.70   ENTER  cube migrates to centre and grows; left + right
//                          columns slide in from their edges.
//   0.70 → 0.78   DWELL  big cube centred; full narrative + journey + stats
//                          + education card visible together.
//   0.78 → 0.80   EXIT   columns lift away; cube migrates right for Signal.
const ENTER_START = 0.61;
const ENTER_END = 0.70;
const EXIT_START = 0.78;
const EXIT_END = 0.80;

const STAGGER_STEP = 0.005;

export default function Arena() {
  const a = ACHIEVEMENTS[0];
  const progress = useScrollProgress();

  const exitP = smoothstep((progress - EXIT_START) / (EXIT_END - EXIT_START));

  const cellProgress = (i: number) => {
    const stagger = i * STAGGER_STEP;
    const inP = smoothstep(
      (progress - (ENTER_START + stagger)) / (ENTER_END - ENTER_START)
    );
    return inP * (1 - exitP);
  };

  // Left column slides in from -X, right column slides in from +X. Both
  // sweep INWARD so the giant cube in the middle is the visual lock.
  const leftStyle = (i: number): React.CSSProperties => {
    const p = cellProgress(i);
    const enterTx = (1 - p) * -100;
    return {
      opacity: p,
      transform: `translateX(${enterTx}px)`,
      willChange: 'transform, opacity',
    };
  };

  const rightStyle = (i: number): React.CSSProperties => {
    const p = cellProgress(i);
    const enterTx = (1 - p) * 100;
    return {
      opacity: p,
      transform: `translateX(${enterTx}px)`,
      willChange: 'transform, opacity',
    };
  };

  return (
    <section
      id="arena"
      className="relative"
      style={{
        // 220vh wrapper covers global progress 0.61 → 0.80 (~19% of total).
        // Sticky inner pins the composed frame so the giant centred cube
        // and surrounding narrative stay locked together.
        height: '220vh',
      }}
    >
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
        {/* Tighter 3 + 4 + 3 grid (was 4 + 4 + 4) so the centre cube column
            is wider and the side text columns sit further from the cube,
            avoiding overlap with the cube's halo. */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-center w-full">
          {/* LEFT — narrative */}
          <div className="lg:col-span-3 flex flex-col">
            <div
              className="flex items-center gap-3"
              style={{ marginBottom: 18, ...leftStyle(0) }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.35em',
                  color: '#4A4A4A',
                }}
              >
                /04
              </span>
              <span
                style={{
                  width: 22,
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
                THE ARENA
              </span>
            </div>

            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(26px, 3.0vw, 44px)',
                fontWeight: 500,
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
                color: '#F5F5F5',
                ...leftStyle(1),
              }}
            >
              Tested in
              <br />
              competition.
            </h2>

            <div
              style={{
                marginTop: 18,
                paddingTop: 16,
                borderTop: '1px solid rgba(255,255,255,0.06)',
                ...leftStyle(2),
              }}
            >
              <h3
                className="font-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  color: '#C5C5C5',
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                {a.title}
              </h3>
              <p
                className="font-mono"
                style={{
                  fontSize: 9,
                  color: '#7A7A7A',
                  letterSpacing: '0.08em',
                  marginBottom: 10,
                }}
              >
                {a.subtitle}
              </p>
              <p
                className="font-sans"
                style={{
                  fontSize: 12,
                  lineHeight: 1.55,
                  color: '#9A9A9A',
                }}
              >
                {a.description}
              </p>
            </div>
          </div>

          {/* CENTER — reserved cube zone (cube grows huge here). Wider than
              before so the cube halo doesn't crash into the side text. */}
          <div
            aria-hidden="true"
            className="hidden lg:block lg:col-span-4"
            style={{ minHeight: 460 }}
          />

          {/* RIGHT — journey timeline + stats + education */}
          <div className="lg:col-span-3 flex flex-col">
            {/* Journey timeline */}
            <div
              style={{
                paddingBottom: 14,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                ...rightStyle(0),
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: 9,
                  letterSpacing: '0.3em',
                  color: '#4A4A4A',
                  display: 'block',
                  marginBottom: 10,
                }}
              >
                /JOURNEY
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {JOURNEY_STEPS.map((s, i) => (
                  <div
                    key={s.label}
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: s.color,
                        boxShadow: `0 0 8px ${s.color}60`,
                      }}
                    />
                    <span
                      className="font-mono"
                      style={{
                        fontSize: 10,
                        letterSpacing: '0.14em',
                        color:
                          i === JOURNEY_STEPS.length - 1 ? s.color : '#C5C5C5',
                        fontWeight: i === JOURNEY_STEPS.length - 1 ? 600 : 400,
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats — real funnel figures for the hackathon: 70K+
                applications narrowed down to 2K accepted. The 2K IS
                the final accepted cohort (no secondary "finalist"
                winnowing step — that was a spec error in an earlier
                draft). Two columns, not three. */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 0,
                paddingTop: 14,
                paddingBottom: 14,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                ...rightStyle(1),
              }}
            >
              {[
                { v: '70K+', l: 'APPLIED' },
                { v: '2K', l: 'SELECTED' },
              ].map((s, i) => (
                <div
                  key={s.l}
                  style={{
                    paddingLeft: i === 0 ? 0 : 14,
                    borderLeft:
                      i === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div
                    className="font-mono"
                    style={{
                      fontSize: 18,
                      fontWeight: 500,
                      color: '#F5F5F5',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {s.v}
                  </div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: 9,
                      color: '#7A7A7A',
                      letterSpacing: '0.18em',
                      marginTop: 4,
                    }}
                  >
                    {s.l}
                  </div>
                </div>
              ))}
            </div>

            {/* Date + location */}
            <div
              style={{ paddingTop: 14, paddingBottom: 14, ...rightStyle(2) }}
              className="font-mono"
            >
              <div
                style={{
                  fontSize: 10,
                  color: '#C5C5C5',
                  letterSpacing: '0.12em',
                  marginBottom: 4,
                }}
              >
                APRIL 25–26, 2026
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: '#7A7A7A',
                  letterSpacing: '0.16em',
                }}
              >
                SCALER SST BANGALORE
              </div>
            </div>

            {/* Education card */}
            <div
              style={{
                padding: 14,
                borderRadius: 10,
                background: '#0F1012',
                border: '1px solid rgba(255,255,255,0.06)',
                ...rightStyle(3),
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: 9,
                  letterSpacing: '0.28em',
                  color: '#4A4A4A',
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                /EDUCATION
              </span>
              <h4
                className="font-display"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#F5F5F5',
                  letterSpacing: '-0.01em',
                  marginBottom: 4,
                }}
              >
                {EDUCATION.institution}
              </h4>
              <p
                className="font-mono"
                style={{
                  fontSize: 10,
                  color: '#9A9A9A',
                  marginBottom: 3,
                  letterSpacing: '0.04em',
                }}
              >
                {EDUCATION.degree}
              </p>
              <p
                className="font-mono"
                style={{
                  fontSize: 9,
                  color: '#7A7A7A',
                  letterSpacing: '0.1em',
                }}
              >
                {EDUCATION.semester} · {EDUCATION.years}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
