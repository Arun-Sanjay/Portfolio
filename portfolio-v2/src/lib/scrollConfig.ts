import type { Chapter, ChapterRange } from '@/types/chapter';

// Chapter ranges aligned with the new section heights:
//   Hero    100vh   →  0    – 0.09
//   Stack   220vh   →  0.09 – 0.29
//   Work    360vh   →  0.29 – 0.61   (3 sub-frames × 120vh)
//   Arena   220vh   →  0.61 – 0.80
//   Signal  220vh   →  0.80 – 1.00
// Total page height ≈ 1120vh. The cube spline (useCubeMotion.ts) keys off
// these same boundaries so the cube reaches each pose exactly as the
// matching section finishes its single-frame reveal.
export const CHAPTER_RANGES: Record<string, ChapterRange> = {
  origin: { start: 0,    end: 0.09 },
  stack:  { start: 0.09, end: 0.29 },
  work:   { start: 0.29, end: 0.61 },
  arena:  { start: 0.61, end: 0.80 },
  signal: { start: 0.80, end: 1.00 },
};

export const CHAPTERS: Chapter[] = [
  { id: 'origin', label: 'Origin', number: '01', range: CHAPTER_RANGES.origin },
  { id: 'stack', label: 'Stack', number: '02', range: CHAPTER_RANGES.stack },
  { id: 'work', label: 'Work', number: '03', range: CHAPTER_RANGES.work },
  { id: 'arena', label: 'Arena', number: '04', range: CHAPTER_RANGES.arena },
  { id: 'signal', label: 'Signal', number: '05', range: CHAPTER_RANGES.signal },
];

export interface CameraKeyframe {
  progress: number;
  x: number;
  y: number;
  z: number;
}

export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  { progress: 0.0, x: 5, y: 0, z: 0 },
  { progress: 0.1, x: 4, y: -0.5, z: 0 },
  { progress: 0.2, x: 0, y: 0, z: 0 },
  { progress: 0.3, x: -5, y: -0.3, z: 0 },
  { progress: 0.4, x: -4, y: 0.2, z: 0 },
  { progress: 0.5, x: 2, y: 0.5, z: 0 },
  { progress: 0.6, x: 5, y: 0, z: 0 },
  { progress: 0.7, x: 0, y: -0.3, z: 0 },
  { progress: 0.8, x: -5, y: 0, z: 0 },
  { progress: 0.9, x: 1, y: 0.3, z: 0 },
  { progress: 1.0, x: 4, y: -0.5, z: 0 },
];
