'use client';

import { useEffect, useRef, useState } from 'react';
import { subscribeScrollProgress } from '@/lib/smoothScroll';

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);
  const rafId = useRef<number>(0);
  const latestProgress = useRef(0);

  useEffect(() => {
    let active = true;

    const unsubscribe = subscribeScrollProgress((p) => {
      latestProgress.current = p;

      if (!rafId.current && active) {
        rafId.current = requestAnimationFrame(() => {
          if (active) {
            setProgress(latestProgress.current);
          }
          rafId.current = 0;
        });
      }
    });

    return () => {
      active = false;
      unsubscribe();
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return progress;
}
