'use client';

import { useEffect, useState } from 'react';

// ---------------------------------------------------------------------------
// Shatter — 27 voxels exploding outward in 3D from the cube centre, on
// a CSS transition curve. Consumed by Cube3D during the open / close
// transitions to sell the "nanotech dissolve" feel.
//
//   progress = 0  → voxels are stacked in a compact 3×3×3 grid (cube)
//   progress = 1  → voxels scattered ~520 px in every direction, tumbling
// ---------------------------------------------------------------------------

const CELL = 26;            // size of each voxel (px)
const GRID_STEP = 30;        // inter-voxel spacing at rest (px)
const EXPLOSION_MAX = 540;   // max scatter distance (px)

interface Voxel {
  gx: number;
  gy: number;
  gz: number;
  radius: number;            // explosion distance
  rx: number;                // tumble rotations (deg)
  ry: number;
  rz: number;
  delay: number;             // stagger (s)
  opacity: number;           // final opacity at full scatter
}

function makeVoxels(): Voxel[] {
  const out: Voxel[] = [];
  let seed = 7919;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let gx = -1; gx <= 1; gx++) {
    for (let gy = -1; gy <= 1; gy++) {
      for (let gz = -1; gz <= 1; gz++) {
        const dist = Math.hypot(gx, gy, gz) || 0.6;
        out.push({
          gx,
          gy,
          gz,
          radius: EXPLOSION_MAX * (0.45 + rnd() * 0.55) * (dist / Math.sqrt(3)),
          rx: (rnd() - 0.5) * 720,
          ry: (rnd() - 0.5) * 720,
          rz: (rnd() - 0.5) * 540,
          delay: rnd() * 0.07,
          opacity: 0.05 + rnd() * 0.25,
        });
      }
    }
  }
  return out;
}

const VOXELS = makeVoxels();

interface Props {
  progress: 0 | 1;      // CSS transition target
  accent: string;       // chapter accent for rim colour
}

export default function Shatter({ progress, accent }: Props) {
  // Always mount at rest (progress=0), flip on next frame so the CSS
  // transition actually plays when progress=1 is requested.
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (progress === 1) {
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setOpen(true))
      );
      return () => cancelAnimationFrame(id);
    }
    setOpen(false);
  }, [progress]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
        transformStyle: 'preserve-3d',
        pointerEvents: 'none',
      }}
    >
      {VOXELS.map((v, i) => {
        const tx = open ? v.gx * v.radius : v.gx * GRID_STEP;
        const ty = open ? v.gy * v.radius : v.gy * GRID_STEP;
        const tz = open ? v.gz * v.radius : v.gz * GRID_STEP;
        const rx = open ? v.rx : 0;
        const ry = open ? v.ry : 0;
        const rz = open ? v.rz : 0;
        const scale = open ? 0.55 : 1;
        const opacity = open ? v.opacity : 1;

        const openDur = '1.05s';
        const closeDur = '0.55s';
        const dur = open ? openDur : closeDur;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: CELL,
              height: CELL,
              top: -CELL / 2,
              left: -CELL / 2,
              transformStyle: 'preserve-3d',
              transform: `translate3d(${tx}px, ${ty}px, ${tz}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`,
              opacity,
              transition: `transform ${dur} cubic-bezier(0.22, 1, 0.36, 1), opacity ${dur} ease-out`,
              transitionDelay: `${v.delay}s`,
              filter: open ? 'blur(1px)' : 'none',
              willChange: 'transform, opacity',
            }}
          >
            {/* Voxel faces — only the 3 visible-from-camera faces rendered */}
            <VoxelFace side="front" accent={accent} />
            <VoxelFace side="top" accent={accent} />
            <VoxelFace side="right" accent={accent} />
          </div>
        );
      })}
    </div>
  );
}

function VoxelFace({
  side,
  accent,
}: {
  side: 'front' | 'top' | 'right';
  accent: string;
}) {
  const r = parseInt(accent.slice(1, 3), 16);
  const g = parseInt(accent.slice(3, 5), 16);
  const b = parseInt(accent.slice(5, 7), 16);

  const HALF = CELL / 2;
  let transform = '';
  let bg = '';
  switch (side) {
    case 'front':
      transform = `translateZ(${HALF}px)`;
      bg = `linear-gradient(145deg, rgba(${r},${g},${b},0.22) 0%, rgba(10,12,18,0.85) 100%)`;
      break;
    case 'top':
      transform = `rotateX(90deg) translateZ(${HALF}px)`;
      bg = `linear-gradient(180deg, rgba(${r},${g},${b},0.14) 0%, rgba(6,7,11,0.9) 100%)`;
      break;
    case 'right':
      transform = `rotateY(90deg) translateZ(${HALF}px)`;
      bg = `linear-gradient(90deg, rgba(6,7,11,0.9) 0%, rgba(${r},${g},${b},0.1) 100%)`;
      break;
  }
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform,
        background: bg,
        border: `1px solid rgba(${r},${g},${b},0.35)`,
        boxShadow: `inset 0 0 6px rgba(${r},${g},${b},0.25)`,
        backfaceVisibility: 'hidden',
      }}
    />
  );
}
