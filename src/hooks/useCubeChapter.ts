'use client';

import { useEffect, useRef, useState } from 'react';
import { subscribeScrollProgress } from '@/lib/smoothScroll';
import { CHAPTERS } from '@/lib/scrollConfig';

export interface CubeChapterData {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  details: string[];
  accent: string;
  accentSoft: string;
}

// Chapter-specific HUD content + per-chapter accent colour. The accent
// tints the cube face, edge glow, corner brackets, and expanded view.
//
// NOTE: the Work chapter splits into three project sub-faces so the cube
// advertises the active project (TITAN / CAMPUSIQ / GENX) as the user
// scrolls through the work section — not a generic "WORK" label.
const CHAPTER_HUD: Record<string, CubeChapterData> = {
  origin: {
    id: 'origin',
    number: '01',
    title: 'ORIGIN',
    subtitle: 'S ARUN SANJAY',
    details: ['DEVELOPER / BUILDER', 'RVCE BANGALORE · 2026'],
    accent: '#4A9EFF',
    accentSoft: 'rgba(74,158,255,0.5)',
  },
  stack: {
    id: 'stack',
    number: '02',
    title: 'THE STACK',
    subtitle: '15+ TECHNOLOGIES',
    details: ['REACT NATIVE · NEXT.JS · PYTHON', 'SUPABASE · THREE.JS · GSAP'],
    accent: '#A855F7',
    accentSoft: 'rgba(168,85,247,0.5)',
  },
  'work-titan': {
    id: 'work-titan',
    number: '03',
    title: 'TITAN PROTOCOL',
    subtitle: 'GAMIFIED PRODUCTIVITY',
    details: ['REACT NATIVE · EXPO · SUPABASE', '20+ BETA · ANDROID 2026'],
    accent: '#5CE0D2',
    accentSoft: 'rgba(92,224,210,0.5)',
  },
  'work-campus': {
    id: 'work-campus',
    number: '03',
    title: 'CAMPUSIQ',
    subtitle: 'AI ACADEMIC PLATFORM',
    details: ['PGVECTOR RAG · WHISPER · MEDIAPIPE', 'RVCE · 6-PERSON TEAM'],
    accent: '#FFB800',
    accentSoft: 'rgba(255,184,0,0.5)',
  },
  'work-genx': {
    id: 'work-genx',
    number: '03',
    title: 'GENX BUILDS',
    subtitle: 'CUSTOM PC BUSINESS',
    details: ['SP ROAD SOURCING · E2E BUILDS', 'COMMISSION · OPERATIONAL'],
    accent: '#FF6B1A',
    accentSoft: 'rgba(255,107,26,0.5)',
  },
  // Fallback for the brief transits in/out of the work chapter (e.g. while
  // swinging from stack to work-1, or work-3 to arena). Keeps the cube
  // coherent if the sub-ranges ever miss a progress value.
  work: {
    id: 'work',
    number: '03',
    title: 'WORK',
    subtitle: 'THREE PRODUCTS',
    details: ['TITAN · CAMPUSIQ · GENX', 'SHIPPED / ACTIVE / OPERATIONAL'],
    accent: '#14B8A6',
    accentSoft: 'rgba(20,184,166,0.5)',
  },
  arena: {
    id: 'arena',
    number: '04',
    title: 'THE ARENA',
    subtitle: 'META × HUGGING FACE',
    details: ['PYTORCH OPENENV HACKATHON', 'FINALIST · APRIL 2026'],
    accent: '#C9A84C',
    accentSoft: 'rgba(201,168,76,0.5)',
  },
  signal: {
    id: 'signal',
    number: '05',
    title: 'SIGNAL',
    subtitle: "LET'S BUILD SOMETHING",
    details: ['GITHUB · EMAIL · LINKEDIN', 'IST (UTC+5:30) · AVAILABLE'],
    accent: '#4A9EFF',
    accentSoft: 'rgba(74,158,255,0.5)',
  },
};

// Work chapter sub-progress → which project owns the cube face right now.
// Tuned to the cube spline: work-titan @ 0.34, work-campus @ 0.45,
// work-genx @ 0.56. Boundaries sit at the midpoints so the face swap
// happens exactly as the user transitions between project sub-frames.
const WORK_SUB_BOUNDARIES: Array<{ start: number; id: string }> = [
  { start: 0.29, id: 'work-titan' },
  { start: 0.40, id: 'work-campus' },
  { start: 0.51, id: 'work-genx' },
];

const FLASH_MS = 150;

function chapterIdFromProgress(progress: number): string {
  // Work chapter is subdivided — the cube face takes on the active
  // project's identity while scrolling through work.
  const workChapter = CHAPTERS.find((c) => c.id === 'work');
  if (
    workChapter &&
    progress >= workChapter.range.start &&
    progress < workChapter.range.end
  ) {
    for (let i = WORK_SUB_BOUNDARIES.length - 1; i >= 0; i--) {
      if (progress >= WORK_SUB_BOUNDARIES[i].start) {
        return WORK_SUB_BOUNDARIES[i].id;
      }
    }
    return 'work';
  }

  for (let i = CHAPTERS.length - 1; i >= 0; i--) {
    if (progress >= CHAPTERS[i].range.start) return CHAPTERS[i].id;
  }
  return CHAPTERS[0].id;
}

export function useCubeChapter() {
  const [data, setData] = useState<CubeChapterData>(CHAPTER_HUD.origin);
  const [flash, setFlash] = useState(false);
  const currentId = useRef('origin');
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeScrollProgress((progress) => {
      const id = chapterIdFromProgress(progress);
      if (id === currentId.current) return;
      currentId.current = id;

      if (flashTimer.current) clearTimeout(flashTimer.current);
      if (setTimer.current) clearTimeout(setTimer.current);

      setFlash(true);
      setTimer.current = setTimeout(() => {
        setData(CHAPTER_HUD[id] ?? CHAPTER_HUD.origin);
        flashTimer.current = setTimeout(() => setFlash(false), FLASH_MS);
      }, FLASH_MS);
    });

    return () => {
      unsubscribe();
      if (flashTimer.current) clearTimeout(flashTimer.current);
      if (setTimer.current) clearTimeout(setTimer.current);
    };
  }, []);

  return { data, flash };
}

export { CHAPTER_HUD };
