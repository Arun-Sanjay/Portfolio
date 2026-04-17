"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ── CatmullRom spline interpolation (pure JS, no Three.js) ──
interface Point { x: number; y: number }

function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}

function interpolateSpline(points: Point[], progress: number): Point {
  const n = points.length - 1;
  const p = Math.max(0, Math.min(1, progress));
  const segment = p * n;
  const i = Math.min(Math.floor(segment), n - 1);
  const t = segment - i;

  // Clamp indices with mirroring at edges
  const p0 = points[Math.max(0, i - 1)];
  const p1 = points[i];
  const p2 = points[Math.min(n, i + 1)];
  const p3 = points[Math.min(n, i + 2)];

  return {
    x: catmullRom(p0.x, p1.x, p2.x, p3.x, t),
    y: catmullRom(p0.y, p1.y, p2.y, p3.y, t),
  };
}

// ── The cube path — x in vw%, y in px offset from center ──
// Zigzag: right → center(brief) → left → center(brief) → right → center → left → center → right
const PATH_POINTS: Point[] = [
  { x: 75, y: 0 },     // Ch1: right zone
  { x: 60, y: -15 },   // transition: crossing
  { x: 25, y: 0 },     // Ch2: left zone
  { x: 50, y: -10 },   // transition: crossing
  { x: 75, y: 0 },     // Ch3a: right zone
  { x: 50, y: -8 },    // transition: crossing
  { x: 25, y: 0 },     // Ch3b: left zone
  { x: 50, y: -10 },   // transition: crossing
  { x: 25, y: 0 },     // Ch4: left zone
  { x: 50, y: -8 },    // transition: crossing
  { x: 75, y: 0 },     // Ch5: right zone
];

export interface CubeMotion {
  x: number;       // vw%
  y: number;       // px offset
  rotY: number;    // degrees — continuous spin
  rotX: number;    // degrees — ambient tilt
  rotZ: number;    // degrees — scroll velocity tilt
  velocity: number;
}

export function useCubeMotion(): CubeMotion {
  const [motion, setMotion] = useState<CubeMotion>({
    x: 78, y: 0, rotY: 0, rotX: 0, rotZ: 0, velocity: 0,
  });

  const prevScroll = useRef(0);
  const prevTime = useRef(performance.now());
  const currentRotY = useRef(0);
  const targetPos = useRef<Point>({ x: 78, y: 0 });
  const currentPos = useRef<Point>({ x: 78, y: 0 });
  const currentRotZ = useRef(0);
  const rafId = useRef(0);

  const tick = useCallback(() => {
    const now = performance.now();
    const dt = Math.min((now - prevTime.current) / 1000, 0.1); // seconds, capped
    prevTime.current = now;

    // Scroll progress 0-1
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

    // Scroll velocity
    const velocity = (scrollTop - prevScroll.current) / Math.max(dt, 0.001);
    prevScroll.current = scrollTop;

    // Spline position
    const target = interpolateSpline(PATH_POINTS, progress);
    targetPos.current = target;

    // Lerp current toward target for extra smoothness
    currentPos.current.x += (target.x - currentPos.current.x) * 0.08;
    currentPos.current.y += (target.y - currentPos.current.y) * 0.08;

    // Continuous Y rotation — slow constant spin
    currentRotY.current += dt * 18; // 18 deg/sec

    // Ambient X tilt based on position (higher when cube is left, lower when right)
    const ambientRotX = Math.sin(now * 0.001 * 0.4) * 4;

    // Scroll velocity → Z tilt (leans into scroll direction)
    const targetRotZ = Math.max(-8, Math.min(8, velocity * 0.004));
    currentRotZ.current += (targetRotZ - currentRotZ.current) * 0.06;

    setMotion({
      x: currentPos.current.x,
      y: currentPos.current.y,
      rotY: currentRotY.current,
      rotX: ambientRotX,
      rotZ: currentRotZ.current,
      velocity,
    });

    rafId.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [tick]);

  return motion;
}
