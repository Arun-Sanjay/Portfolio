"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { subscribeScrollProgress, getScrollProgress } from "@/lib/smoothScroll";

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  const handleScroll = useCallback((p: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setProgress(p);
    });
  }, []);

  useEffect(() => {
    setProgress(getScrollProgress());
    const unsub = subscribeScrollProgress(handleScroll);
    return () => {
      unsub();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  return progress;
}
