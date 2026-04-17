import * as THREE from "three";

export const CHAPTER_RANGES = {
  origin: { start: 0.0, end: 0.2 },
  stack: { start: 0.2, end: 0.4 },
  projects: { start: 0.4, end: 0.7 },
  arena: { start: 0.7, end: 0.85 },
  signal: { start: 0.85, end: 1.0 },
} as const;

export const CHAPTERS = [
  { id: "origin", label: "Origin", number: "01", range: CHAPTER_RANGES.origin },
  { id: "stack", label: "The Stack", number: "02", range: CHAPTER_RANGES.stack },
  { id: "projects", label: "What I've Built", number: "03", range: CHAPTER_RANGES.projects },
  { id: "arena", label: "The Arena", number: "04", range: CHAPTER_RANGES.arena },
  { id: "signal", label: "Signal", number: "05", range: CHAPTER_RANGES.signal },
] as const;

export interface CameraKeyframe {
  progress: number;
  position: [number, number, number];
  lookAt: [number, number, number];
}

export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  { progress: 0.0, position: [0, 0, 10], lookAt: [0, 0, 0] },
  { progress: 0.08, position: [0, 0, 8], lookAt: [0, 0, 0] },
  { progress: 0.15, position: [0, 0, 5], lookAt: [0, 0, -5] },
  { progress: 0.2, position: [0, 0, 0], lookAt: [0, 0, -10] },
  { progress: 0.28, position: [0, 0, -5], lookAt: [0, 0, -15] },
  { progress: 0.35, position: [0, 0, -15], lookAt: [0, 0, -25] },
  { progress: 0.4, position: [0, 0, -25], lookAt: [0, 0, -35] },
  { progress: 0.42, position: [0, 0, -30], lookAt: [0, 0, -40] },
  { progress: 0.7, position: [0, 0, -45], lookAt: [0, 0, -50] },
  { progress: 0.75, position: [0, 2, -48], lookAt: [0, 0, -55] },
  { progress: 0.85, position: [0, 5, -50], lookAt: [0, 0, -30] },
  { progress: 0.95, position: [0, 15, -20], lookAt: [0, 0, -25] },
  { progress: 1.0, position: [0, 20, -15], lookAt: [0, 0, -25] },
];

export function createCameraPath() {
  const positionPoints = CAMERA_KEYFRAMES.map(
    (kf) => new THREE.Vector3(...kf.position)
  );
  const lookAtPoints = CAMERA_KEYFRAMES.map(
    (kf) => new THREE.Vector3(...kf.lookAt)
  );

  const positionCurve = new THREE.CatmullRomCurve3(positionPoints, false, "catmullrom", 0.5);
  const lookAtCurve = new THREE.CatmullRomCurve3(lookAtPoints, false, "catmullrom", 0.5);

  return { positionCurve, lookAtCurve };
}

export function getProgressForKeyframe(index: number): number {
  return CAMERA_KEYFRAMES[index]?.progress ?? 0;
}

// Map scroll progress (0-1) to curve parameter (0-1)
// Since keyframes aren't evenly spaced, we need to interpolate
export function scrollToCurveParam(scrollProgress: number): number {
  const keyframes = CAMERA_KEYFRAMES;
  const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

  // Find the two surrounding keyframes
  let startIdx = 0;
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (clampedProgress >= keyframes[i].progress && clampedProgress <= keyframes[i + 1].progress) {
      startIdx = i;
      break;
    }
    if (i === keyframes.length - 2) {
      startIdx = i;
    }
  }

  const startKf = keyframes[startIdx];
  const endKf = keyframes[startIdx + 1];
  const rangeProgress = endKf.progress - startKf.progress;
  const localProgress = rangeProgress > 0
    ? (clampedProgress - startKf.progress) / rangeProgress
    : 0;

  // Map to curve parameter space
  const curveStart = startIdx / (keyframes.length - 1);
  const curveEnd = (startIdx + 1) / (keyframes.length - 1);

  return curveStart + localProgress * (curveEnd - curveStart);
}
