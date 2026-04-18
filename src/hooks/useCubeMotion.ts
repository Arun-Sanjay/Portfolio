'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { subscribeScrollProgress } from '@/lib/smoothScroll';

// ---------------------------------------------------------------------------
// Cube motion — viewport-anchored, scroll-driven choreography spline.
//
// DESIGN INTENT (per user spec, seventh pass — "loader + immediate sweep"):
//   • Boot: the app shows a cyberpunk loading screen first. While the
//     loader is up, the cube sits huge and centred (scale ~3.5, xFrac 0)
//     hidden behind the loader — `awaitingIntro` is true and the scroll
//     spline is ignored. When the loader starts fading, `startCubeIntro`
//     fires. The cube then eases from (0, 3.5) → (hero pose) over
//     INTRO_DURATION_MS while the Hero copy staggers in. Effect: cube
//     "emerges" by shrinking from screen-fill to its anchor position.
//   • Hero: once the intro completes, the cube sits on the RIGHT side
//     (xFrac +0.55, scale 1.10). The MOMENT the user scrolls it begins
//     sweeping LEFT — there is NO dwell at the right. There's no
//     `hero-hold` pose; the spline interpolates directly from `hero`
//     (xFrac +0.55 at p=0) to `stack-in` (xFrac −0.55 at p=0.13), so
//     even a single pixel of scroll produces motion.
//   • Stack/Work: cube stays vertically centred. Horizontal storytelling
//     axis only.
//   • Work: three dedicated sticky sub-frames (Titan / CampusIQ / GenX);
//     cube holds on the right, face swaps at each crossfade centre so
//     the face change and the card crossfade read as one event.
//   • Arena: cube migrates back to centre and grows BIG (~1.30) to dominate
//     the final-act frame — but small enough that the surrounding text
//     does not collide with it.
//   • Signal: cube STAYS LARGE (~1.40, slightly bigger than Arena because
//     Signal has more breathing room) and lands on the right while the
//     contact text packs into the left column.
//
// Section heights (px):
//   Hero    100vh   →  0    – 0.09
//   Stack   220vh   →  0.09 – 0.29
//   Work    360vh   →  0.29 – 0.61   (3 sub-frames × 120vh each)
//     ├── titan   0.29 – 0.40
//     ├── campus  0.40 – 0.51
//     └── genx    0.51 – 0.61
//   Arena   220vh   →  0.61 – 0.80
//   Signal  220vh   →  0.80 – 1.00
// ---------------------------------------------------------------------------

const CONTENT_MAX = 1440;
const CONTENT_PAD = 48;

interface Pose {
  id: string;
  progress: number;   // scroll progress (0-1) where this pose is reached
  xFrac: number;      // -1..1, fraction of content half-width from centre
  yPx: number;        // px offset from viewport vertical centre
  scale: number;
  face: 0 | 1 | 2 | 3 | 4;
}

const SPLINE: Pose[] = [
  // Hero — anchored on the RIGHT (xFrac=+0.78) at first paint, slightly
  // oversized (scale 1.15). No vertical offset, no bottom-bias. The cube
  // begins sweeping LEFT the moment the user scrolls — the old
  // `hero-hold` pose that kept it parked at the right through p≤0.07 is
  // gone, so the interpolator goes straight from `hero` (xFrac +0.78)
  // to `stack-in` (xFrac −0.55) across 0.00 → 0.13. That matches Stack's
  // text entrance window (also now starting at 0) — cube leaving its
  // hero slot and text sliding in from the left read as one exchange.
  { id: 'hero-pre',    progress: -0.05, xFrac:  0.65, yPx:   0, scale: 1.15, face: 0 },
  { id: 'hero',        progress:  0.00, xFrac:  0.65, yPx:   0, scale: 1.15, face: 0 },
  // Rightward → leftward sweep into Stack. Shrinks 1.15 → 0.92 so the
  // cube "settles down" into its Stack slot as it crosses the viewport.
  { id: 'stack-in',    progress:  0.13, xFrac: -0.55, yPx:   0, scale: 0.92, face: 1 },
  // Stack DWELL — cube on left, all skill columns visible together.
  { id: 'stack',       progress:  0.25, xFrac: -0.55, yPx:   0, scale: 0.92, face: 1 },
  // Stack → Work-titan: cube swings to the RIGHT, scales up a touch (each
  // project gets a dedicated full-frame and the cube is the visual lock on
  // the right side, so it can carry a bit more presence).
  { id: 'work-titan',  progress:  0.34, xFrac:  0.55, yPx:   0, scale: 1.00, face: 2 },
  // Work tick poses — cube X stays put, face swaps via useCubeChapter so
  // the cube advertises Titan → CampusIQ → GenX in sequence.
  { id: 'work-campus', progress:  0.45, xFrac:  0.55, yPx:   0, scale: 1.00, face: 2 },
  { id: 'work-genx',   progress:  0.56, xFrac:  0.55, yPx:   0, scale: 1.00, face: 2 },
  // Work → Arena: cube migrates back to CENTRE and grows. Scale tuned so
  // it dominates without colliding with the left/right narrative columns.
  { id: 'arena-in',    progress:  0.66, xFrac:  0.00, yPx:   0, scale: 1.20, face: 3 },
  { id: 'arena',       progress:  0.74, xFrac:  0.00, yPx:   0, scale: 1.30, face: 3 },
  // Arena → Signal: cube STAYS LARGE (slightly bigger than Arena, since
  // Signal has more breathing room) and shifts to the RIGHT so the contact
  // panel takes the left column.
  { id: 'signal-in',   progress:  0.85, xFrac:  0.28, yPx:   0, scale: 1.35, face: 4 },
  { id: 'signal',      progress:  0.94, xFrac:  0.28, yPx:   0, scale: 1.40, face: 4 },
  { id: 'signal-out',  progress:  1.05, xFrac:  0.28, yPx:   0, scale: 1.40, face: 4 },
];

// Target rotation per face (degrees) — rotate the cube so that face comes
// forward to the viewer.
const FACE_ROT_Y = [0, 270, 180, 90, 0];
const FACE_ROT_X = [0, 0, 0, 0, -90];

function catmullRom(
  p0: number,
  p1: number,
  p2: number,
  p3: number,
  t: number
): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  );
}

// Soft ease — smoothstep applied to the local segment parameter so we
// dwell near each control point and sweep briskly through the middle.
function smoothstep(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

function interpolate(progress: number): {
  xFrac: number;
  yPx: number;
  scale: number;
  face: 0 | 1 | 2 | 3 | 4;
} {
  // Find segment [i, i+1] that contains progress.
  let i = 0;
  for (let k = 1; k < SPLINE.length; k++) {
    if (progress <= SPLINE[k].progress) {
      i = k - 1;
      break;
    }
    if (k === SPLINE.length - 1) i = k - 1;
  }

  const p0 = SPLINE[Math.max(0, i - 1)];
  const p1 = SPLINE[i];
  const p2 = SPLINE[i + 1];
  const p3 = SPLINE[Math.min(SPLINE.length - 1, i + 2)];

  const segLen = Math.max(0.0001, p2.progress - p1.progress);
  const tRaw = Math.max(0, Math.min(1, (progress - p1.progress) / segLen));
  const t = smoothstep(tRaw);

  // Pick the face of whichever anchor we're closer to.
  const face = tRaw < 0.5 ? p1.face : p2.face;

  return {
    xFrac: catmullRom(p0.xFrac, p1.xFrac, p2.xFrac, p3.xFrac, t),
    yPx:   catmullRom(p0.yPx,   p1.yPx,   p2.yPx,   p3.yPx,   t),
    scale: catmullRom(p0.scale, p1.scale, p2.scale, p3.scale, t),
    face,
  };
}

function computeContentWidth(viewportW: number): number {
  const usable = Math.min(viewportW, CONTENT_MAX);
  return Math.max(0, usable - 2 * CONTENT_PAD);
}

export interface CubeMotion {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotY: number;
  rotX: number;
  rotZ: number;
  faceIndex: 0 | 1 | 2 | 3 | 4;
}

// ---------------------------------------------------------------------------
// Intro override — module-level so page.tsx can fire `startCubeIntro()`
// exactly when the loading screen begins its fade-out. Until that call,
// `awaitingIntro` is true and the cube is forced to its pre-intro pose
// (huge, centred, scale INTRO_START_SCALE) so the very first frame after
// the loader lifts is the "emerging" state rather than the hero pose.
// During the intro window, the tick loop blends from that pre-intro pose
// toward the scroll-driven spline pose on an ease-out curve — so even
// if the user immediately scrolls, the emergence and the scroll handoff
// are smooth.
// ---------------------------------------------------------------------------
const INTRO_DURATION_MS = 1100;
const INTRO_START_SCALE = 3.6;
const INTRO_START_XFRAC = 0;

let awaitingIntro = true;
let introStartTs: number | null = null;

export function startCubeIntro(): void {
  awaitingIntro = false;
  introStartTs =
    typeof performance !== 'undefined' ? performance.now() : Date.now();
}

function introEase(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - x, 3);
}

export function useCubeMotion(): CubeMotion {
  const first = interpolate(0);
  const [viewportW, setViewportW] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  // Seed with the pre-intro pose (huge, centred). Loader sits on top of
  // the cube so this state is invisible until `startCubeIntro()` fires
  // and the loader fades — at which point the blend in tick() animates
  // out of this pose toward the scroll-driven spline.
  const [state, setState] = useState<CubeMotion>({
    x: 0,
    y: 0,
    scale: INTRO_START_SCALE,
    opacity: 1,
    rotY: FACE_ROT_Y[first.face],
    rotX: FACE_ROT_X[first.face],
    rotZ: 0,
    faceIndex: first.face,
  });

  const progress = useRef(0);
  const rotY = useRef(FACE_ROT_Y[first.face]);
  const rotX = useRef(FACE_ROT_X[first.face]);
  const rotZ = useRef(0);
  const targetRotY = useRef(FACE_ROT_Y[first.face]);
  const targetRotX = useRef(FACE_ROT_X[first.face]);
  const currentFace = useRef<0 | 1 | 2 | 3 | 4>(first.face);
  const prevTime = useRef(
    typeof performance !== 'undefined' ? performance.now() : 0
  );
  const prevProgress = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    const onResize = () => {
      setViewportW(window.innerWidth);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    return subscribeScrollProgress((p) => {
      progress.current = p;
    });
  }, []);

  const tick = useCallback(() => {
    const now = performance.now();
    const dt = Math.min((now - prevTime.current) / 1000, 0.1);
    prevTime.current = now;

    if (progress.current === 0 && typeof window !== 'undefined') {
      const top = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.current = h > 0 ? top / h : 0;
    }

    const p = progress.current;
    const velocity = (p - prevProgress.current) / Math.max(dt, 0.001);
    prevProgress.current = p;

    const pose = interpolate(p);
    const contentW = computeContentWidth(viewportW);

    // Intro override: before `startCubeIntro()` fires, hold the cube at
    // the huge-centred pre-intro pose (hidden under the loader). After
    // it fires, blend from that pose toward the scroll-driven pose over
    // INTRO_DURATION_MS on an ease-out curve. Once the window elapses,
    // we fall straight through to the scroll-driven pose.
    let scaleOut = pose.scale;
    let xFracOut = pose.xFrac;
    if (awaitingIntro) {
      scaleOut = INTRO_START_SCALE;
      xFracOut = INTRO_START_XFRAC;
    } else if (introStartTs !== null) {
      const elapsed = now - introStartTs;
      if (elapsed >= INTRO_DURATION_MS) {
        introStartTs = null;
      } else {
        const t = introEase(elapsed / INTRO_DURATION_MS);
        scaleOut = INTRO_START_SCALE + (pose.scale - INTRO_START_SCALE) * t;
        xFracOut = INTRO_START_XFRAC + (pose.xFrac - INTRO_START_XFRAC) * t;
      }
    }

    // Viewport-aware clamp so the cube never clips the window edge on
    // narrower viewports (the content column can be wider than the
    // viewport when padding is included). Keep a small margin so the
    // ambient halo isn't cut off either. During the intro's scale-3.6
    // phase the clamp drops to zero (cube must stay dead-centred).
    const cubeVisualHalf = (300 * scaleOut) / 2;
    const maxOffset = Math.max(0, viewportW / 2 - cubeVisualHalf - 24);
    const xRaw = (contentW / 2) * xFracOut;
    const x = Math.max(-maxOffset, Math.min(maxOffset, xRaw));

    // Face rotation — update target on face change, shortest-path unrolling.
    if (pose.face !== currentFace.current) {
      currentFace.current = pose.face;
      const nextY = FACE_ROT_Y[pose.face];
      const delta = ((nextY - (targetRotY.current % 360)) + 540) % 360 - 180;
      targetRotY.current += delta;
      targetRotX.current = FACE_ROT_X[pose.face];
    }

    const kRot = 1 - Math.exp(-dt * 3.2);
    rotY.current += (targetRotY.current - rotY.current) * kRot;
    rotX.current += (targetRotX.current - rotX.current) * kRot;

    // Z tilt for scroll-direction feedback.
    const targetZ = Math.max(-3, Math.min(3, velocity * 30));
    rotZ.current += (targetZ - rotZ.current) * 0.06;

    const ambientY = Math.sin(now * 0.00028) * 2;
    const ambientX = Math.sin(now * 0.00022) * 1.5;

    setState({
      x,
      y: pose.yPx,
      scale: scaleOut,
      opacity: 1,
      rotY: rotY.current + ambientY,
      rotX: rotX.current + ambientX,
      rotZ: rotZ.current,
      faceIndex: pose.face,
    });

    raf.current = requestAnimationFrame(tick);
  }, [viewportW]);

  useEffect(() => {
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [tick]);

  return state;
}
