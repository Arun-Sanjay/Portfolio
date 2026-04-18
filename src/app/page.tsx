'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { initSmoothScroll } from '@/lib/smoothScroll';
import { useIsMobile } from '@/hooks/useIsMobile';
import { startCubeIntro } from '@/hooks/useCubeMotion';

/* Atmosphere */
import GradientBg from '@/components/atmosphere/GradientBg';
import GrainOverlay from '@/components/atmosphere/GrainOverlay';
import Vignette from '@/components/atmosphere/Vignette';
import AmbientParticles from '@/components/atmosphere/AmbientParticles';

/* Layout Chrome */
import Navbar from '@/components/layout/Navbar';
import ChapterIndicator from '@/components/layout/ChapterIndicator';
import ScrollProgress from '@/components/layout/ScrollProgress';
import CustomCursor from '@/components/layout/CustomCursor';
import LoadingScreen from '@/components/layout/LoadingScreen';

/* Sections */
import Hero from '@/components/sections/Hero';
import Stack from '@/components/sections/Stack';
import Work from '@/components/sections/Work';
import Arena from '@/components/sections/Arena';
import Signal from '@/components/sections/Signal';

/* Projects (expanded overlay portal) */
import ExpandedRouter from '@/components/projects/ExpandedRouter';

/* Cube — CSS 3D, scroll-driven, chapter-themed */
const Cube3D = dynamic(() => import('@/components/cube/Cube3D'), { ssr: false });

export default function Home() {
  const isMobile = useIsMobile();
  // `ready` flips when the LoadingScreen begins its fade-out. That single
  // event triggers three things in lock-step: loader fades, cube emerges
  // from its huge-centred pre-intro pose, and the hero text staggers in.
  const [ready, setReady] = useState(false);
  // `loaderGone` flips when the loader has fully unmounted, so we can
  // suppress scroll locking / fixed-positioned chrome while the overlay
  // is still in the DOM.
  const [loaderGone, setLoaderGone] = useState(false);

  useEffect(() => {
    const cleanup = initSmoothScroll();
    return cleanup;
  }, []);

  // Lock page scroll while the loader is up so users can't scroll past
  // the hero before the intro finishes.
  useEffect(() => {
    if (loaderGone) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [loaderGone]);

  const handleLoaderExit = useCallback(() => {
    setReady(true);
    startCubeIntro();
  }, []);

  const handleLoaderGone = useCallback(() => {
    setLoaderGone(true);
  }, []);

  return (
    <main className="relative">
      {/* Boot sequence — sits on top until the progress bar fills and
          the exit fade completes. Kicks off cube emergence + hero
          stagger at the START of its fade so the reveal and the
          emerging animation overlap. */}
      <LoadingScreen
        onExitStart={handleLoaderExit}
        onComplete={handleLoaderGone}
      />

      {/* Persistent HUD cube — hidden on mobile */}
      {!isMobile && <Cube3D />}

      {/* Project themed environments (portal to body) */}
      <ExpandedRouter />

      {/* Atmosphere */}
      <GradientBg />
      <GrainOverlay />
      <Vignette />
      <AmbientParticles />

      {/* Layout chrome */}
      <Navbar />
      <ChapterIndicator />
      <ScrollProgress />
      <CustomCursor />

      {/* Scrollable content */}
      <div className="relative z-[2]">
        <Hero ready={ready} />
        <Stack />
        <Work />
        <Arena />
        <Signal />
      </div>
    </main>
  );
}
