"use client";

import { useMemo } from "react";
import { CHAPTERS } from "@/lib/scrollConfig";
import { useScrollProgress } from "./useScrollProgress";

export function useChapter() {
  const progress = useScrollProgress();

  const current = useMemo(() => {
    for (let i = CHAPTERS.length - 1; i >= 0; i--) {
      if (progress >= CHAPTERS[i].range.start) {
        return CHAPTERS[i];
      }
    }
    return CHAPTERS[0];
  }, [progress]);

  return current;
}
