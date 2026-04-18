'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  /** Fires the moment the loader begins its fade-out, so the parent can
   *  kick off the cube emergence + hero stagger in lock-step with the
   *  loader lifting. */
  onExitStart: () => void;
  /** Fires when the loader element is fully removed from the DOM. */
  onComplete: () => void;
}

const PROGRESS_DURATION = 1800;
const HOLD_DURATION = 200;
const FADE_DURATION = 600;

// Cyberpunk HUD-style loader: progress bar fills, holds briefly at 100%,
// then fades to black while the cube emerges behind it. Visual language
// mirrors the cube's own HUD face (mono caption, corner brackets, dashed
// bracket line, electric-blue fill) so the boot sequence feels like the
// cube HUD "powering up" before the content arrives.
export default function LoadingScreen({ onExitStart, onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const exitFiredRef = useRef(false);

  useEffect(() => {
    const start =
      typeof performance !== 'undefined' ? performance.now() : Date.now();
    let rafId = 0;
    const tick = () => {
      const now =
        typeof performance !== 'undefined' ? performance.now() : Date.now();
      const p = Math.min(1, (now - start) / PROGRESS_DURATION);
      setProgress(p);
      if (p < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => {
          if (exitFiredRef.current) return;
          exitFiredRef.current = true;
          setExiting(true);
          onExitStart();
        }, HOLD_DURATION);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onExitStart]);

  const pct = Math.round(progress * 100);
  const pctDisplay = pct.toString().padStart(2, '0');

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!exiting && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_DURATION / 1000, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: '#0A0A0A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto',
          }}
          aria-label="Loading"
          role="status"
        >
          {/* faint scan-line texture to match the cube HUD aesthetic */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              backgroundImage:
                'repeating-linear-gradient(to bottom, rgba(255,255,255,0.012) 0, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 3px)',
              opacity: 0.6,
              mixBlendMode: 'overlay',
            }}
          />

          {/* corner brackets */}
          {[
            { top: 28, left: 28, rotate: 0 },
            { top: 28, right: 28, rotate: 90 },
            { bottom: 28, right: 28, rotate: 180 },
            { bottom: 28, left: 28, rotate: 270 },
          ].map(({ rotate, ...pos }, i) => (
            <svg
              key={i}
              width={32}
              height={32}
              viewBox="0 0 32 32"
              style={{
                position: 'absolute',
                ...pos,
                transform: `rotate(${rotate}deg)`,
                pointerEvents: 'none',
              }}
            >
              <path
                d="M 1 12 L 1 1 L 12 1"
                fill="none"
                stroke="rgba(74, 158, 255, 0.5)"
                strokeWidth={1.2}
              />
            </svg>
          ))}

          {/* top-left system label */}
          <div
            style={{
              position: 'absolute',
              top: 28,
              left: 72,
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 10,
              letterSpacing: '0.3em',
              color: 'rgba(74, 158, 255, 0.55)',
            }}
          >
            SYS.BOOT // v2.6
          </div>

          {/* top-right status */}
          <div
            style={{
              position: 'absolute',
              top: 28,
              right: 72,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 10,
              letterSpacing: '0.3em',
              color: 'rgba(74, 158, 255, 0.55)',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#4A9EFF',
                boxShadow: '0 0 8px rgba(74,158,255,0.7)',
                animation: 'hudPulse 1.8s ease-in-out infinite',
              }}
            />
            ACTIVE
          </div>

          <div style={{ width: 420, maxWidth: '80vw', textAlign: 'center', position: 'relative' }}>
            <div
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: 11,
                letterSpacing: '0.4em',
                color: 'rgba(74, 158, 255, 0.7)',
                marginBottom: 22,
              }}
            >
              INITIALIZING
            </div>

            <div
              style={{
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: 'clamp(30px, 3.6vw, 44px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#F5F5F5',
                marginBottom: 30,
                lineHeight: 1.05,
              }}
            >
              ARUN SANJAY
            </div>

            {/* progress bar */}
            <div
              style={{
                position: 'relative',
                height: 2,
                width: '100%',
                background: 'rgba(255, 255, 255, 0.07)',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${pct}%`,
                  background: '#4A9EFF',
                  boxShadow: '0 0 14px rgba(74, 158, 255, 0.7)',
                  transition: 'width 80ms linear',
                }}
              />
            </div>

            {/* percent + caption row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 14,
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: 10,
                letterSpacing: '0.28em',
                color: 'rgba(245, 245, 245, 0.45)',
              }}
            >
              <span style={{ color: 'rgba(74, 158, 255, 0.85)' }}>
                {pctDisplay}%
              </span>
              <span>BOOTING CHAPTERS</span>
            </div>
          </div>

          {/* bottom-center hint */}
          <div
            style={{
              position: 'absolute',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 9,
              letterSpacing: '0.32em',
              color: 'rgba(245, 245, 245, 0.28)',
            }}
          >
            S.PORTFOLIO // HOLD
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
