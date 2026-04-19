'use client';

import { memo } from 'react';
import type { CubeChapterData } from '@/hooks/useCubeChapter';

const SIZE = 300;

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-jetbrains), monospace',
};

// Memoised — CHAPTER_HUD entries are module-level constants, so the data
// prop reference is stable across Cube3D re-renders that don't actually
// change the chapter. Without this, each face repaints its SVG grid and
// corner brackets 60× per second under the old useCubeMotion setState
// loop (and still occasionally under the new ref-based loop whenever
// other state changes in Cube3D).
function HudFaceImpl({ data }: { data: CubeChapterData }) {
  const { accent, number, title, subtitle, details } = data;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background:
          'linear-gradient(155deg, #0D1015 0%, #07090D 55%, #04060A 100%)',
        position: 'relative',
      }}
    >
      {/* Faint grid — barely visible, more texture than detail */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.5,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: 4 }).map((_, i) => {
          const pos = ((i + 1) / 5) * SIZE;
          return (
            <g key={i}>
              <line
                x1={pos}
                y1={0}
                x2={pos}
                y2={SIZE}
                stroke={hexToRgba(accent, 0.03)}
                strokeWidth={1}
              />
              <line
                x1={0}
                y1={pos}
                x2={SIZE}
                y2={pos}
                stroke={hexToRgba(accent, 0.03)}
                strokeWidth={1}
              />
            </g>
          );
        })}

        {/* Corner brackets */}
        {[
          `M10,28 L10,10 L28,10`,
          `M${SIZE - 28},10 L${SIZE - 10},10 L${SIZE - 10},28`,
          `M10,${SIZE - 28} L10,${SIZE - 10} L28,${SIZE - 10}`,
          `M${SIZE - 28},${SIZE - 10} L${SIZE - 10},${SIZE - 10} L${SIZE - 10},${SIZE - 28}`,
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={hexToRgba(accent, 0.32)}
            strokeWidth={1.25}
          />
        ))}
      </svg>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 26px',
        }}
      >
        {/* Top row: chapter + status dot */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              ...mono,
              fontSize: 9,
              letterSpacing: '0.4em',
              color: hexToRgba(accent, 0.7),
              fontWeight: 600,
            }}
          >
            CH.{number}
          </span>
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: accent,
              boxShadow: `0 0 10px ${accent}`,
              animation: 'hudPulse 2.6s ease-in-out infinite',
            }}
          />
        </div>

        {/* Center: title, rule, subtitle, details */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              ...mono,
              fontSize: title.length > 8 ? 22 : 28,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '0.05em',
              color: '#F5F5F5',
              textShadow: `0 0 26px ${hexToRgba(accent, 0.4)}`,
              marginBottom: 14,
            }}
          >
            {title}
          </div>
          <div
            style={{
              width: 38,
              height: 1,
              margin: '0 auto 14px',
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            }}
          />
          <div
            style={{
              ...mono,
              fontSize: 10,
              color: 'rgba(255,255,255,0.55)',
              marginBottom: 12,
              fontWeight: 500,
              letterSpacing: '0.14em',
            }}
          >
            {subtitle}
          </div>
          {details.map((line, i) => (
            <div
              key={i}
              style={{
                ...mono,
                fontSize: 9,
                color: 'rgba(255,255,255,0.3)',
                marginBottom: 3,
                letterSpacing: '0.1em',
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Bottom: system + click hint */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              ...mono,
              fontSize: 7,
              letterSpacing: '0.28em',
              color: hexToRgba(accent, 0.3),
            }}
          >
            {'//SYS'}
          </span>
          <span
            style={{
              ...mono,
              fontSize: 7,
              letterSpacing: '0.32em',
              color: hexToRgba(accent, 0.45),
              animation: 'blink 2.4s ease-in-out infinite',
            }}
          >
            [ CLICK ]
          </span>
        </div>
      </div>

      {/* Subtle sheen */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 4,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.015) 100%)',
        }}
      />
    </div>
  );
}

const HudFace = memo(HudFaceImpl);
export default HudFace;
