"use client";

import { useState, useCallback } from "react";

export interface CubeChapterData {
  chapter: number;
  title: string;
  subtitle: string;
  details: string[];
  accent: string;
}

const CHAPTERS: CubeChapterData[] = [
  { chapter: 1, title: "ORIGIN", subtitle: "S Arun Sanjay", details: ["Developer & Founder"], accent: "rgba(0,240,255,0.5)" },
  { chapter: 2, title: "THE STACK", subtitle: "15+ Technologies", details: ["React Native · Next.js · Python", "Supabase · Three.js · Git"], accent: "rgba(168,85,247,0.5)" },
  { chapter: 3, title: "PROJECTS", subtitle: "PROJECT 01", details: ["TITAN PROTOCOL", "Cross-Platform Productivity"], accent: "rgba(16,185,129,0.5)" },
  { chapter: 3, title: "PROJECTS", subtitle: "PROJECT 02", details: ["CAMPUSIQ", "AI Academic Platform"], accent: "rgba(16,185,129,0.5)" },
  { chapter: 4, title: "ARENA", subtitle: "Hackathon Finalist", details: ["Meta PyTorch × Hugging Face"], accent: "rgba(201,168,76,0.5)" },
  { chapter: 5, title: "SIGNAL", subtitle: "Let's build something.", details: ["GitHub · Email · LinkedIn"], accent: "rgba(0,240,255,0.5)" },
];

export function useCubeChapter() {
  const [data, setData] = useState<CubeChapterData>(CHAPTERS[0]);
  const [flash, setFlash] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setChapterIndex = useCallback((index: number) => {
    if (index === currentIndex) return;
    const next = CHAPTERS[index] ?? CHAPTERS[0];
    setCurrentIndex(index);
    // Opacity flash
    setFlash(true);
    setTimeout(() => {
      setData(next);
      setTimeout(() => setFlash(false), 150);
    }, 150);
  }, [currentIndex]);

  return { data, flash, setChapterIndex };
}
