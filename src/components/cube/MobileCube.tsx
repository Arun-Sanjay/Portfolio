'use client';

import type { CSSProperties } from 'react';
import {
  useCubeChapter,
  CHAPTER_HUD,
  type CubeChapterData,
} from '@/hooks/useCubeChapter';

// ---------------------------------------------------------------------------
// MobileCube — the phone counterpart to Cube3D.
//
// Why this exists as its own component:
//   Cube3D drives its transform via useCubeMotion, which runs a RAF loop
//   and calls setState every frame. On desktop the reconciliation cost is
//   negligible; on mid-range phones it's a ~30fps drag before we count
//   the blur(100px) halos and the 6 full HudFace renders. This component
//   renders the same conceptual cube (6 chapter-themed faces, face swap
//   on chapter change, subtle idle motion) with zero per-frame JS: the
//   chapter rotation rides a CSS `transition` and the idle sway rides a
//   CSS `@keyframes` — both compositor-only.
//
// Placement:
//   Fixed top-right corner, 96×96. Below the mobile navbar (which ends at
//   56px), clear of the hero text column (Hero caps headline at 60% width).
//   zIndex 3 so it sits above atmosphere but remains unobtrusive; pointer
//   events disabled because the shatter/expanded-view flow is desktop-only.
// ---------------------------------------------------------------------------

const SIZE = 96;
const HALF = SIZE / 2;

// Each chapter's target rotation. Values flow in one direction around Y
// (origin → stack → work → arena) so forward scrolling reads as a single
// continuous rotation. Signal breaks out on the X axis (cube tilts up so
// the +Y top face comes forward) preserving the "something above" metaphor
// from the desktop cube.
const CHAPTER_ROT: Record<string, { rotY: number; rotX: number }> = {
  origin:        { rotY:    0, rotX:   0 },
  stack:         { rotY:  -90, rotX:   0 },
  work:          { rotY: -180, rotX:   0 },
  'work-titan':  { rotY: -180, rotX:   0 },
  'work-campus': { rotY: -180, rotX:   0 },
  'work-genx':   { rotY: -180, rotX:   0 },
  arena:         { rotY: -270, rotX:   0 },
  signal:        { rotY: -270, rotX: -90 },
};

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const mono: CSSProperties = {
  fontFamily: 'var(--font-jetbrains), monospace',
};

// Balance a two-word title across two lines; single words stay on one.
function splitTitle(title: string): string[] {
  const words = title.split(' ');
  if (words.length === 1) return [title];
  let bestIdx = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ').length;
    const b = words.slice(i).join(' ').length;
    const diff = Math.abs(a - b);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }
  return [
    words.slice(0, bestIdx).join(' '),
    words.slice(bestIdx).join(' '),
  ];
}

// Face order mirrors Cube3D: +Z / +X / -Z / -X / +Y / -Y.
// The -Z (back) face is the work face and picks up the active project.
function facesForChapter(activeId: string): CubeChapterData[] {
  const workId = activeId.startsWith('work-') ? activeId : 'work';
  return [
    CHAPTER_HUD.origin,                               // +Z front
    CHAPTER_HUD.stack,                                // +X right
    CHAPTER_HUD[workId] ?? CHAPTER_HUD.work,          // -Z back
    CHAPTER_HUD.arena,                                // -X left
    CHAPTER_HUD.signal,                               // +Y top
    CHAPTER_HUD.origin,                               // -Y bottom (fallback)
  ];
}

function MiniFace({ data }: { data: CubeChapterData }) {
  const { accent, number, title } = data;
  const lines = splitTitle(title);
  const longest = Math.max(...lines.map((l) => l.length));
  const fontSize = longest > 8 ? 9 : longest > 5 ? 11 : 13;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#07090D',
        position: 'relative',
        border: `1px solid ${hexToRgba(accent, 0.24)}`,
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: `inset 0 0 16px ${hexToRgba(accent, 0.06)}`,
      }}
    >
      {/* Corner brackets — 4 tiny L-paths in accent. SVG renders once, no
          per-frame updates. */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
      >
        {[
          `M6,14 L6,6 L14,6`,
          `M${SIZE - 14},6 L${SIZE - 6},6 L${SIZE - 6},14`,
          `M6,${SIZE - 14} L6,${SIZE - 6} L14,${SIZE - 6}`,
          `M${SIZE - 14},${SIZE - 6} L${SIZE - 6},${SIZE - 6} L${SIZE - 6},${SIZE - 14}`,
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={hexToRgba(accent, 0.6)}
            strokeWidth={1.25}
          />
        ))}
      </svg>

      {/* Chapter number — top-left */}
      <span
        style={{
          ...mono,
          position: 'absolute',
          top: 9,
          left: 11,
          fontSize: 7,
          letterSpacing: '0.3em',
          color: hexToRgba(accent, 0.75),
          fontWeight: 600,
        }}
      >
        CH.{number}
      </span>

      {/* Pulse dot — top-right, reuses the existing hudPulse keyframe */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 11,
          right: 11,
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: accent,
          boxShadow: `0 0 6px ${accent}`,
          animation: 'hudPulse 2.6s ease-in-out infinite',
        }}
      />

      {/* Title — centred, balanced across up to two lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '18px 6px 14px 6px',
          textAlign: 'center',
        }}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              ...mono,
              fontSize,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: '0.05em',
              color: '#F5F5F5',
              textShadow: `0 0 8px ${hexToRgba(accent, 0.4)}`,
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Bottom accent bar — tiny gradient rule, anchors the face visually */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 9,
          left: '50%',
          width: 22,
          height: 1,
          transform: 'translateX(-50%)',
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />
    </div>
  );
}

const faceBase: CSSProperties = {
  position: 'absolute',
  width: SIZE,
  height: SIZE,
  backfaceVisibility: 'hidden',
};

export default function MobileCube() {
  const { data } = useCubeChapter();
  const rot = CHAPTER_ROT[data.id] ?? CHAPTER_ROT.origin;
  const faces = facesForChapter(data.id);
  const accent = data.accent;

  return (
    <aside
      aria-hidden="true"
      className="fixed md:hidden pointer-events-none select-none"
      style={{
        top: 68,
        right: 16,
        width: SIZE,
        height: SIZE,
        zIndex: 3,
      }}
    >
      {/* Ambient accent wash — radial gradient, no filter blur. The
          gradient naturally softens so we get a chapter-tinted halo for
          essentially the cost of a rectangle. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-40%',
          background: `radial-gradient(circle at center, ${hexToRgba(
            accent,
            0.24,
          )} 0%, transparent 65%)`,
          opacity: 0.8,
          transition: 'background 0.8s ease, opacity 0.8s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Perspective stage. Keeping perspective small (560) tightens the
          3D parallax for a cube this size so edges feel crisp rather than
          isometric. */}
      <div
        style={{
          width: '100%',
          height: '100%',
          perspective: 560,
          position: 'relative',
        }}
      >
        {/* Idle sway — CSS keyframes on the compositor. Runs forever at
            ~0 CPU cost and lets the cube feel alive even when the user
            isn't scrolling. */}
        <div
          style={{
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            animation: 'mobileCubeSway 14s ease-in-out infinite',
            willChange: 'transform',
          }}
        >
          {/* Chapter rotation — transitions between the six target poses
              via the compositor. No React state ticks, no raf loop. */}
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              transformStyle: 'preserve-3d',
              transform: `rotateY(${rot.rotY}deg) rotateX(${rot.rotX}deg)`,
              transition: 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)',
              willChange: 'transform',
            }}
          >
            {/* +Z front — origin */}
            <div style={{ ...faceBase, transform: `translateZ(${HALF}px)` }}>
              <MiniFace data={faces[0]} />
            </div>
            {/* +X right — stack */}
            <div
              style={{
                ...faceBase,
                transform: `rotateY(90deg) translateZ(${HALF}px)`,
              }}
            >
              <MiniFace data={faces[1]} />
            </div>
            {/* -Z back — work (active project face) */}
            <div
              style={{
                ...faceBase,
                transform: `rotateY(180deg) translateZ(${HALF}px)`,
              }}
            >
              <MiniFace data={faces[2]} />
            </div>
            {/* -X left — arena */}
            <div
              style={{
                ...faceBase,
                transform: `rotateY(-90deg) translateZ(${HALF}px)`,
              }}
            >
              <MiniFace data={faces[3]} />
            </div>
            {/* +Y top — signal */}
            <div
              style={{
                ...faceBase,
                transform: `rotateX(90deg) translateZ(${HALF}px)`,
              }}
            >
              <MiniFace data={faces[4]} />
            </div>
            {/* -Y bottom — origin mirror (rarely visible, kept so the
                cube is closed on every side) */}
            <div
              style={{
                ...faceBase,
                transform: `rotateX(-90deg) translateZ(${HALF}px)`,
              }}
            >
              <MiniFace data={faces[5]} />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
