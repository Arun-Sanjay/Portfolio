'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import { useCubeMotion } from '@/hooks/useCubeMotion';
import { useCubeChapter, CHAPTER_HUD } from '@/hooks/useCubeChapter';
import HudFace from './HudFace';
import ExpandedView from './ExpandedView';
import Shatter from './Shatter';
import { openProject, subscribeProject } from '@/lib/projectOverlay';

const SIZE = 300;
const HALF = SIZE / 2;
const SHATTER_MS = 460;
const REFORM_MS = 620;

type Phase = 'closed' | 'opening' | 'expanded' | 'closing';

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const faceBase: React.CSSProperties = {
  position: 'absolute',
  width: SIZE,
  height: SIZE,
  backfaceVisibility: 'hidden',
  borderRadius: 14,
  overflow: 'hidden',
  boxShadow:
    'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 28px rgba(0,0,0,0.4)',
};

// Face order around the cube. The -Z (back) face is the WORK face and
// picks up whichever project is active (TITAN / CAMPUSIQ / GENX) as the
// cube ticks through the work chapter.
function buildFaceData(workId: string) {
  const workFace =
    workId === 'work-titan' || workId === 'work-campus' || workId === 'work-genx'
      ? CHAPTER_HUD[workId]
      : CHAPTER_HUD.work;
  return [
    CHAPTER_HUD.origin,  // +Z front
    CHAPTER_HUD.stack,   // +X right  → rotateY(270) brings it forward
    workFace,             // -Z back   → rotateY(180)
    CHAPTER_HUD.arena,   // -X left   → rotateY(90)
    CHAPTER_HUD.signal,  // +Y top    → rotateX(-90)
    CHAPTER_HUD.origin,  // -Y bottom → fallback mirror of origin
  ];
}

export default function Cube3D() {
  const motion = useCubeMotion();
  const { data } = useCubeChapter(); // drives ExpandedView content + face swap
  const accent = data.accent;
  const faceData = buildFaceData(data.id);

  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>('closed');
  const [project, setProject] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    return subscribeProject((id) => setProject(id));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (project) setProject(null);
      else if (phase === 'expanded') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, project]);

  function open() {
    if (phase !== 'closed') return;
    // Fast path — if the cube face is currently showing a specific project
    // (work-titan / work-campus / work-genx), clicking it jumps straight
    // into that project's themed environment instead of the generic work
    // list. The shatter still plays so the motion reads the same.
    const directProjectMap: Record<string, string> = {
      'work-titan': 'titan',
      'work-campus': 'campusiq',
      'work-genx': 'genx',
    };
    const directId = directProjectMap[data.id];
    if (directId) {
      setPhase('opening');
      window.setTimeout(() => {
        setPhase('closed');
        openProject(directId);
      }, SHATTER_MS);
      return;
    }
    setPhase('opening');
    window.setTimeout(() => setPhase('expanded'), SHATTER_MS);
  }

  function close() {
    if (phase !== 'expanded') return;
    setPhase('closing');
    window.setTimeout(() => setPhase('closed'), REFORM_MS);
  }

  const shatterActive = phase !== 'closed';
  const hideCube = shatterActive || !!project;

  // Tick meta readout — shown only during the work chapter, pinned to the
  // cube's left side so each tick (TITAN / CAMPUSIQ / GENX) surfaces a
  // matching text panel exactly where the cube has its tick-mark motion.
  const isWorkFace =
    data.id === 'work-titan' ||
    data.id === 'work-campus' ||
    data.id === 'work-genx';

  return (
    <>
      {/* Fixed wrapper — content-relative px offset from viewport center */}
      <div
        aria-hidden={hideCube}
        className="fixed select-none"
        style={{
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${motion.x}px), calc(-50% + ${motion.y}px))`,
          width: SIZE,
          height: SIZE,
          pointerEvents: hideCube || motion.opacity < 0.2 ? 'none' : 'auto',
          opacity: motion.opacity,
          zIndex: 5,
          willChange: 'transform, opacity',
        }}
      >
        {/* Ambient halo — much softer than before */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: SIZE * 2.4,
            height: SIZE * 2.4,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${hexToRgba(accent, 0.04)} 0%, transparent 55%)`,
            filter: 'blur(100px)',
            pointerEvents: 'none',
            transition: 'background 0.9s ease, opacity 0.4s ease',
            opacity: shatterActive ? 0.3 : 0.9,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: SIZE * 1.3,
            height: SIZE * 1.3,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${hexToRgba(accent, 0.09)} 0%, transparent 72%)`,
            filter: 'blur(48px)',
            pointerEvents: 'none',
            transition: 'background 0.9s ease, opacity 0.4s ease',
            animation: 'cubeGlow 5s ease-in-out infinite',
            opacity: shatterActive ? 0.25 : 1,
          }}
        />

        {/* Core 3D stage */}
        <div
          style={{
            perspective: 1600,
            perspectiveOrigin: 'center center',
            width: SIZE,
            height: SIZE,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <button
            type="button"
            onClick={open}
            aria-label={`Expand chapter ${data.number} — ${data.title}`}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'transparent',
              border: 0,
              padding: 0,
              cursor: phase === 'closed' ? 'pointer' : 'default',
              opacity: phase === 'closed' ? 1 : 0,
              transition: 'opacity 0.2s ease',
              pointerEvents: phase === 'closed' ? 'auto' : 'none',
            }}
          >
            <div
              style={{
                width: SIZE,
                height: SIZE,
                transformStyle: 'preserve-3d',
                transform: `scale(${motion.scale}) rotateX(${motion.rotX}deg) rotateY(${motion.rotY}deg) rotateZ(${motion.rotZ}deg)`,
                willChange: 'transform',
              }}
            >
              {/* Face 0: +Z front  → origin */}
              <div style={{ ...faceBase, transform: `translateZ(${HALF}px)` }}>
                <HudFace data={faceData[0]} />
              </div>
              {/* Face 1: +X right → stack */}
              <div
                style={{
                  ...faceBase,
                  transform: `rotateY(90deg) translateZ(${HALF}px)`,
                }}
              >
                <HudFace data={faceData[1]} />
              </div>
              {/* Face 2: -Z back → work */}
              <div
                style={{
                  ...faceBase,
                  transform: `rotateY(180deg) translateZ(${HALF}px)`,
                }}
              >
                <HudFace data={faceData[2]} />
              </div>
              {/* Face 3: -X left → arena */}
              <div
                style={{
                  ...faceBase,
                  transform: `rotateY(-90deg) translateZ(${HALF}px)`,
                }}
              >
                <HudFace data={faceData[3]} />
              </div>
              {/* Face 4: +Y top → signal */}
              <div
                style={{
                  ...faceBase,
                  transform: `rotateX(90deg) translateZ(${HALF}px)`,
                }}
              >
                <HudFace data={faceData[4]} />
              </div>
              {/* Face 5: -Y bottom → origin mirror (fallback) */}
              <div
                style={{
                  ...faceBase,
                  transform: `rotateX(-90deg) translateZ(${HALF}px)`,
                }}
              >
                <HudFace data={faceData[5]} />
              </div>
            </div>
          </button>

          {shatterActive && (
            <Shatter
              progress={phase === 'opening' || phase === 'expanded' ? 1 : 0}
              accent={accent}
            />
          )}
        </div>
      </div>

      {/* Tick tag — small identifier that floats BELOW the cube as it ticks
          through work slots. Vertically below avoids the tight horizontal
          space between the project cards and the cube. */}
      <div
        aria-hidden="true"
        className="fixed select-none hidden lg:flex"
        style={{
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${motion.x}px), calc(-50% + ${motion.y}px + 170px))`,
          opacity: !hideCube && isWorkFace ? motion.opacity : 0,
          transition: 'opacity 0.28s ease',
          pointerEvents: 'none',
          zIndex: 4,
          willChange: 'transform, opacity',
          fontFamily: 'var(--font-jetbrains), monospace',
          alignItems: 'center',
          gap: 10,
          padding: '8px 14px',
          borderRadius: 999,
          background: 'rgba(10,10,10,0.72)',
          border: `1px solid ${accent}55`,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: accent,
            boxShadow: `0 0 10px ${accent}`,
          }}
        />
        <span
          style={{
            fontSize: 10,
            letterSpacing: '0.28em',
            color: '#F5F5F5',
            fontWeight: 500,
          }}
        >
          {data.title}
        </span>
        <span
          style={{
            fontSize: 9,
            letterSpacing: '0.22em',
            color: '#7A7A7A',
          }}
        >
          {data.subtitle}
        </span>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {phase === 'expanded' && !project && (
              <ExpandedView
                key="chapter-expansion"
                data={data}
                onClose={close}
                onOpenProject={(id) => {
                  close();
                  openProject(id);
                }}
              />
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
