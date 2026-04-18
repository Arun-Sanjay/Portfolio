'use client';

import { useScrollProgress } from '@/hooks/useScrollProgress';
import ProjectCard from '@/components/projects/ProjectCard';
import { PROJECTS } from '@/lib/constants';

// Same ease as the cube spline so every reveal reads as one motion with
// the cube, not a second system running beside it.
function smoothstep(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

// Work scroll choreography — 3 dedicated sub-frames, each pinning ONE
// big project card. Cube ticks to that project on the right of every
// frame, and the section heading ("Three products. Real users.") rides
// along on the left so the user always knows the chapter context.
//
//   PROJECT 1  TITAN     0.29 → 0.40   sticky frame
//   PROJECT 2  CAMPUSIQ  0.40 → 0.51   sticky frame
//   PROJECT 3  GENX      0.51 → 0.61   sticky frame
//
// Each sub-frame uses a 120vh wrapper with a 100vh sticky inner so the
// active project's card stays pinned in the viewport while the user
// scrolls through its slot.

// Per-project GLOBAL-progress ramps. Each project's EXIT window is the
// same window as the next project's ENTER — so the two cards crossfade
// directly into each other. At the crossfade midpoint both are at 50%
// opacity, which means there is NEVER a global-progress value during
// Work where every card is at 0. Fixes the "empty frame" the user saw
// between Titan → CampusIQ → GenX.
//
// Face-swap points (0.40, 0.51) sit at the midpoint of each crossfade
// so the cube's face change and the card crossfade land in the same
// beat — the transition reads as one event instead of two.
const PROJECT_RAMPS = [
  // Titan: enter 0.25 → 0.30 (cube starts sweeping right from stack).
  // Exit starts at 0.34 (right at Titan's dwell peak) so the card
  // begins fading the instant the user scrolls past its focus — no
  // long dwell with nothing else appearing. Exit runs to 0.42.
  { enterStart: 0.25, enterEnd: 0.30, exitStart: 0.34, exitEnd: 0.42 },
  // CampusIQ: enter starts at 0.33 — BEFORE its sub-frame range
  // (0.40-0.51) begins, so the card is already fading in as its
  // container slides up from the bottom of the viewport. No empty
  // gap between Titan scrolling off top and CampusIQ rising from
  // below. Exit 0.45 → 0.53 (overlapping with GenX entrance).
  { enterStart: 0.33, enterEnd: 0.42, exitStart: 0.45, exitEnd: 0.53 },
  // GenX: enter starts at 0.44 — again before its sub-frame range
  // (0.51-0.61) begins, so GenX is already visible as its container
  // rises into view while CampusIQ is fading out. No opacity exit —
  // the natural sticky scroll-off at the end of Work (0.61) plus
  // Arena's entrance takes over.
  { enterStart: 0.44, enterEnd: 0.53, exitStart: 1.0,  exitEnd: 1.0  },
];

type Ramp = (typeof PROJECT_RAMPS)[number];

const SUB_FRAMES = [
  { project: PROJECTS[0], range: { start: 0.29, end: 0.40 }, ramp: PROJECT_RAMPS[0] },
  { project: PROJECTS[1], range: { start: 0.40, end: 0.51 }, ramp: PROJECT_RAMPS[1] },
  { project: PROJECTS[2], range: { start: 0.51, end: 0.61 }, ramp: PROJECT_RAMPS[2] },
];

function trapezoid(p: number, r: Ramp): number {
  if (p <= r.enterStart) return 0;
  if (p < r.enterEnd) {
    return smoothstep((p - r.enterStart) / (r.enterEnd - r.enterStart));
  }
  if (p < r.exitStart) return 1;
  if (p < r.exitEnd) {
    return 1 - smoothstep((p - r.exitStart) / (r.exitEnd - r.exitStart));
  }
  return 0;
}

function computeRevealAndFocus(
  globalProgress: number,
  ramp: Ramp,
  range: { start: number; end: number }
) {
  const reveal = trapezoid(globalProgress, ramp);
  // Focus: sharper bell peaking at the project's range midpoint (where
  // the cube's face has fully locked onto that project). Used for
  // scale/hover emphasis on the active card so only the focused
  // project feels fully dialled in, even during a crossfade.
  const centre = (range.start + range.end) / 2;
  const span = range.end - range.start;
  const focus = Math.max(
    0,
    1 - Math.abs(globalProgress - centre) / (span * 0.6)
  );
  // Lift is a no-op here — CSS sticky handles the vertical motion as
  // the card scrolls off the top and the next one slides up from the
  // bottom. Adding a translateY here would double that motion.
  return { reveal, focus, lift: 0 };
}

// Section heading reveal — slides in from left with the first project,
// fades on the way out of the last one.
const HEADING_ENTER_START = 0.29;
const HEADING_ENTER_END = 0.34;
const HEADING_EXIT_START = 0.58;
const HEADING_EXIT_END = 0.61;

export default function Work() {
  const progress = useScrollProgress();

  const headingEnter = smoothstep(
    (progress - HEADING_ENTER_START) /
      (HEADING_ENTER_END - HEADING_ENTER_START)
  );
  const headingExit = smoothstep(
    (progress - HEADING_EXIT_START) /
      (HEADING_EXIT_END - HEADING_EXIT_START)
  );
  const headingP = headingEnter * (1 - headingExit);
  const headingStyle: React.CSSProperties = {
    opacity: headingP,
    transform: `translateX(${(1 - headingP) * -40}px)`,
    willChange: 'transform, opacity',
  };

  return (
    <section
      id="work"
      className="relative"
      style={{
        // 360vh wrapper → 3 sub-frames × 120vh each. Covers global progress
        // 0.29 → 0.61 (~32% of the total page height).
        height: '360vh',
      }}
    >
      {SUB_FRAMES.map(({ project, range, ramp }, i) => {
        const { reveal, focus, lift } = computeRevealAndFocus(
          progress,
          ramp,
          range
        );
        const isActive = reveal > 0;
        return (
          <div
            key={project.id}
            // Each sub-frame is 120vh tall; the inner content sticks for
            // the entire 120vh so the project card stays pinned in view
            // while the user scrolls through that slot.
            style={{ height: '120vh', position: 'relative' }}
          >
            <div
              className="sticky top-0 px-6 md:px-10 lg:px-16"
              style={{
                height: '100vh',
                maxWidth: 1440,
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                // Hide non-active frames from pointer events so clicks
                // always go to the project the user is looking at.
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
                {/* LEFT — section heading + the active project's BIG card. */}
                <div className="lg:col-span-7 flex flex-col">
                  {/* Numbered chapter label + heading — rides through all
                      three sub-frames so the section context is always
                      anchored. Only renders for the first sub-frame; on
                      sub-frames 2 and 3, the heading area shows the
                      project counter (01 / 02 / 03 of three). */}
                  {i === 0 ? (
                    <>
                      <div
                        className="flex items-center gap-3"
                        style={{ marginBottom: 24, ...headingStyle }}
                      >
                        <span
                          className="font-mono"
                          style={{
                            fontSize: 10,
                            letterSpacing: '0.35em',
                            color: '#4A4A4A',
                          }}
                        >
                          /03
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
                          WORK
                        </span>
                      </div>

                      <h2
                        className="font-display"
                        style={{
                          fontSize: 'clamp(34px, 4.4vw, 64px)',
                          fontWeight: 500,
                          letterSpacing: '-0.04em',
                          lineHeight: 0.95,
                          color: '#F5F5F5',
                          marginBottom: 14,
                          ...headingStyle,
                        }}
                      >
                        Three products.
                        <br />
                        Real users.
                      </h2>

                      <p
                        className="font-sans"
                        style={{
                          fontSize: 14,
                          lineHeight: 1.55,
                          color: '#9A9A9A',
                          marginTop: 8,
                          marginBottom: 28,
                          maxWidth: 460,
                          ...headingStyle,
                        }}
                      >
                        Each one ships, has users, and pays back the work.
                        Click through to see how they were built.
                      </p>
                    </>
                  ) : (
                    <ProjectCounter index={i + 1} headingP={headingP} />
                  )}

                  {/* Active project card — slides in from the left as the
                      cube ticks to it on the right. */}
                  <div
                    style={{
                      transform: `translateY(${lift}px)`,
                      transition: 'transform 0.4s ease-out',
                    }}
                  >
                    <ProjectCard
                      project={project}
                      reveal={reveal}
                      focus={focus}
                    />
                  </div>
                </div>

                {/* RIGHT — reserved cube zone (cube is fixed-positioned over
                    it and ticks to this project). */}
                <div
                  aria-hidden="true"
                  className="hidden lg:block lg:col-span-5"
                  style={{ minHeight: 480 }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

// Compact "PROJECT 02 OF 03" counter shown above the card on sub-frames
// 2 and 3 so the user always knows where they are in the work walk-through.
function ProjectCounter({
  index,
  headingP,
}: {
  index: number;
  headingP: number;
}) {
  return (
    <div
      className="flex items-center gap-3"
      style={{
        marginBottom: 24,
        opacity: headingP,
        transform: `translateX(${(1 - headingP) * -32}px)`,
        willChange: 'transform, opacity',
      }}
    >
      <span
        className="font-mono"
        style={{
          fontSize: 10,
          letterSpacing: '0.35em',
          color: '#4A4A4A',
        }}
      >
        /03 · PROJECT 0{index}
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
        WORK · 0{index} OF 03
      </span>
    </div>
  );
}
