'use client';

import { useCallback, useEffect, useRef } from 'react';
import { subscribeScrollProgress } from '@/lib/smoothScroll';

// ---------------------------------------------------------------------------
// Cube motion — viewport-anchored, scroll-driven choreography spline.
//
// PERF NOTE (2026-04-19): this hook used to call `setState` every RAF tick,
// which triggered a full Cube3D reconciliation 60× per second. Desktop
// shrugged it off; mid-range phones choked. The hook now writes transforms
// directly to two refs (`wrapperRef` for the outer translate, `innerRef`
// for the inner scale/rotate). React only renders Cube3D on chapter
// boundaries via useCubeChapter — ~5 times per page scroll. Combined with
// memoised HudFace and unfiltered halos, this brings the cube to full
// 60fps on phones while keeping the full desktop choreography.
//
// DESIGN INTENT (unchanged):
//   • Boot: loader covers a huge centred cube (scale 3.6). When the loader
//     starts fading, `startCubeIntro` fires and the cube blends to the hero
//     pose over INTRO_DURATION_MS.
//   • Hero → Stack → Work → Arena → Signal: spline drives x-sweep, scale,
//     and which face comes forward. See SPLINE below.
//   • Below 768px the cube's scale is multiplied by 0.55 so the same
//     choreography fits a phone viewport without clipping.
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
const CUBE_SIZE_PX = 300;
const MOBILE_BREAKPOINT = 768;
const MOBILE_SCALE_FACTOR = 0.55;

interface Pose {
  id: string;
  progress: number;   // scroll progress (0-1) where this pose is reached
  xFrac: number;      // -1..1, fraction of content half-width from centre
  yPx: number;        // px offset from viewport vertical centre
  scale: number;
  face: 0 | 1 | 2 | 3 | 4;
}

const SPLINE: Pose[] = [
  { id: 'hero-pre',    progress: -0.05, xFrac:  0.65, yPx:   0, scale: 1.15, face: 0 },
  { id: 'hero',        progress:  0.00, xFrac:  0.65, yPx:   0, scale: 1.15, face: 0 },
  { id: 'stack-in',    progress:  0.13, xFrac: -0.55, yPx:   0, scale: 0.92, face: 1 },
  { id: 'stack',       progress:  0.25, xFrac: -0.55, yPx:   0, scale: 0.92, face: 1 },
  { id: 'work-titan',  progress:  0.34, xFrac:  0.55, yPx:   0, scale: 1.00, face: 2 },
  { id: 'work-campus', progress:  0.45, xFrac:  0.55, yPx:   0, scale: 1.00, face: 2 },
  { id: 'work-genx',   progress:  0.56, xFrac:  0.55, yPx:   0, scale: 1.00, face: 2 },
  { id: 'arena-in',    progress:  0.66, xFrac:  0.00, yPx:   0, scale: 1.20, face: 3 },
  { id: 'arena',       progress:  0.74, xFrac:  0.00, yPx:   0, scale: 1.30, face: 3 },
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
  t: number,
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

// ---------------------------------------------------------------------------
// Intro override — module-level so page.tsx can fire `startCubeIntro()`
// exactly when the loading screen begins its fade-out. Until that call,
// `awaitingIntro` is true and the cube is forced to its pre-intro pose
// (huge, centred) so the very first frame after the loader lifts is the
// "emerging" state rather than the hero pose.
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

export interface CubeMotionHandle {
  /** Attach to the fixed outer wrapper — the hook writes translate here. */
  wrapperRef: (node: HTMLElement | null) => void;
  /** Attach to the preserve-3d element — the hook writes scale+rotate here. */
  innerRef: (node: HTMLElement | null) => void;
}

export function useCubeMotion(): CubeMotionHandle {
  const first = interpolate(0);
  const wrapperEl = useRef<HTMLElement | null>(null);
  const innerEl = useRef<HTMLElement | null>(null);
  const viewportW = useRef<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1440,
  );

  const progress = useRef(0);
  const rotY = useRef(FACE_ROT_Y[first.face]);
  const rotX = useRef(FACE_ROT_X[first.face]);
  const rotZ = useRef(0);
  const targetRotY = useRef(FACE_ROT_Y[first.face]);
  const targetRotX = useRef(FACE_ROT_X[first.face]);
  const currentFace = useRef<0 | 1 | 2 | 3 | 4>(first.face);
  const prevTime = useRef(
    typeof performance !== 'undefined' ? performance.now() : 0,
  );
  const prevProgress = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    const onResize = () => {
      viewportW.current = window.innerWidth;
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
    const vw = viewportW.current;
    const contentW = computeContentWidth(vw);

    // Intro override — before startCubeIntro() fires, hold the pre-intro
    // pose (hidden under the loader). After it fires, blend from that
    // pose toward the scroll-driven pose over INTRO_DURATION_MS.
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

    // Mobile scale — keep the spline's choreography, just scaled down so
    // the 300px base cube fits a phone viewport. The x-clamp below adapts
    // to the smaller visual footprint naturally.
    if (vw < MOBILE_BREAKPOINT) scaleOut *= MOBILE_SCALE_FACTOR;

    // Viewport-aware clamp so the cube never clips the window edge on
    // narrow viewports.
    const cubeVisualHalf = (CUBE_SIZE_PX * scaleOut) / 2;
    const maxOffset = Math.max(0, vw / 2 - cubeVisualHalf - 24);
    const xRaw = (contentW / 2) * xFracOut;
    const x = Math.max(-maxOffset, Math.min(maxOffset, xRaw));

    // Face rotation — update target on face change, shortest-path unrolling.
    if (pose.face !== currentFace.current) {
      currentFace.current = pose.face;
      const nextY = FACE_ROT_Y[pose.face];
      const delta =
        (((nextY - (targetRotY.current % 360)) + 540) % 360) - 180;
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

    // Direct DOM writes — no React reconciliation per frame.
    if (wrapperEl.current) {
      wrapperEl.current.style.transform =
        `translate(calc(-50% + ${x}px), calc(-50% + ${pose.yPx}px))`;
    }
    if (innerEl.current) {
      innerEl.current.style.transform =
        `scale(${scaleOut}) rotateX(${rotX.current + ambientX}deg) rotateY(${rotY.current + ambientY}deg) rotateZ(${rotZ.current}deg)`;
    }

    raf.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [tick]);

  const wrapperRef = useCallback((node: HTMLElement | null) => {
    wrapperEl.current = node;
  }, []);
  const innerRef = useCallback((node: HTMLElement | null) => {
    innerEl.current = node;
  }, []);

  return { wrapperRef, innerRef };
}
