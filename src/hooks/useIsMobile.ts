'use client';

import { useEffect, useState } from 'react';

// Lazy initialiser reads the MQL synchronously on first client render so
// the cube selector in page.tsx mounts the correct component (MobileCube
// vs Cube3D) from frame 1 — no flash of the desktop cube on phones.
// SSR sees `undefined window` and defaults to false (desktop); the
// components that consume this are dynamic({ ssr: false }) so that path
// never actually renders on the server.
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 767px)').matches;
  });

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    handleChange(mql);
    mql.addEventListener('change', handleChange);

    return () => {
      mql.removeEventListener('change', handleChange);
    };
  }, []);

  return isMobile;
}
