'use client';

import { useMemo } from 'react';
import { useScrollProgress } from './useScrollProgress';
import { CHAPTERS } from '@/lib/scrollConfig';
import type { Chapter } from '@/types/chapter';

export function useChapter(): Chapter {
  const progress = useScrollProgress();

  const chapter = useMemo(() => {
    for (let i = CHAPTERS.length - 1; i >= 0; i--) {
      if (progress >= CHAPTERS[i].range.start) {
        return CHAPTERS[i];
      }
    }
    return CHAPTERS[0];
  }, [progress]);

  return chapter;
}
