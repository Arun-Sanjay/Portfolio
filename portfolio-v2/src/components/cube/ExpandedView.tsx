'use client';

import { motion } from 'framer-motion';
import { Code2, Mail, ExternalLink } from 'lucide-react';
import type { CubeChapterData } from '@/hooks/useCubeChapter';
import {
  PROJECTS,
  SKILLS,
  ACHIEVEMENTS,
  EDUCATION,
  CONTACT,
} from '@/lib/constants';

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-jetbrains), monospace',
};

// ---------------------------------------------------------------------------
// 9-panel 3D unfold order. Centre first → inward spiral outward.
// Each panel emerges with a 3D flip from its own pivot.
// ---------------------------------------------------------------------------
const STAGGER = [4, 1, 7, 3, 5, 0, 2, 6, 8];

// Per-panel unfold rotation (around which 3D axis the panel opens from).
const UNFOLD = [
  { rx:  60, ry: -40, tz: -280 }, // TL
  { rx:  60, ry:   0, tz: -320 }, // T
  { rx:  60, ry:  40, tz: -280 }, // TR
  { rx:   0, ry: -55, tz: -260 }, // L
  { rx:   0, ry:   0, tz: -380 }, // C
  { rx:   0, ry:  55, tz: -260 }, // R
  { rx: -60, ry: -40, tz: -280 }, // BL
  { rx: -60, ry:   0, tz: -320 }, // B
  { rx: -60, ry:  40, tz: -280 }, // BR
];

interface Props {
  data: CubeChapterData;
  onClose: () => void;
  onOpenProject: (id: string) => void;
}

export default function ExpandedView({ data, onClose, onOpenProject }: Props) {
  const accent = data.accent;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label={`${data.title} — deep dive`}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background:
          'radial-gradient(ellipse at center, rgba(12,14,20,0.92) 0%, rgba(2,3,5,0.98) 60%, #000 100%)',
        backdropFilter: 'blur(34px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(34px) saturate(1.2)',
        overflow: 'hidden',
        cursor: 'pointer',
        perspective: 1600,
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* Shock-wave ring that pulses out from cube centre */}
      <motion.div
        initial={{ scale: 0.1, opacity: 0.9 }}
        animate={{ scale: 6, opacity: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 320,
          height: 320,
          marginLeft: -160,
          marginTop: -160,
          borderRadius: '50%',
          border: `1px solid ${hexToRgba(accent, 0.55)}`,
          boxShadow: `0 0 80px ${hexToRgba(accent, 0.45)}, inset 0 0 60px ${hexToRgba(accent, 0.2)}`,
          pointerEvents: 'none',
        }}
      />

      {/* Scan-line sweep — thin horizontal line drags from top to bottom */}
      <motion.div
        initial={{ y: '-20vh', opacity: 0 }}
        animate={{ y: '120vh', opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.3, ease: 'easeOut', times: [0, 0.1, 0.85, 1] }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          boxShadow: `0 0 24px ${hexToRgba(accent, 0.8)}`,
          pointerEvents: 'none',
        }}
      />

      {/* Scan-line static overlay (thin repeating lines) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.012) 0px,
            rgba(255,255,255,0.012) 1px,
            transparent 1px,
            transparent 3px
          )`,
          opacity: 0.6,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Chromatic aberration: two offset colour layers that fade during motion */}
      <motion.div
        initial={{ opacity: 0.75 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(ellipse at center, ${hexToRgba(accent, 0.1)} 0%, transparent 45%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* Corner brackets — pro HUD frame */}
      <CornerBrackets accent={accent} />

      {/* Top-left telemetry */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{
          position: 'absolute',
          top: 32,
          left: 32,
          ...mono,
          fontSize: 9,
          letterSpacing: '0.25em',
          color: hexToRgba(accent, 0.55),
          pointerEvents: 'none',
        }}
      >
        <div>
          CH.{data.number} {'//'} {data.title}
        </div>
        <div style={{ marginTop: 4, color: hexToRgba(accent, 0.3) }}>
          MODE: EXPANDED · ENV: {data.id.toUpperCase()}
        </div>
      </motion.div>

      {/* Top-right telemetry */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{
          position: 'absolute',
          top: 32,
          right: 32,
          ...mono,
          fontSize: 9,
          letterSpacing: '0.25em',
          color: hexToRgba(accent, 0.55),
          textAlign: 'right',
          pointerEvents: 'none',
        }}
      >
        <div>SYS.HUD · v2.6</div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            justifyContent: 'flex-end',
            marginTop: 4,
            color: hexToRgba(accent, 0.7),
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: accent,
              boxShadow: `0 0 8px ${accent}`,
              animation: 'hudPulse 2.4s ease-in-out infinite',
            }}
          />
          ACTIVE
        </div>
      </motion.div>

      {/* 3D panel grid — unfolds from cube centre */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: 2,
          padding: '9vh 5vw',
          pointerEvents: 'none',
          transformStyle: 'preserve-3d',
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => {
          const order = STAGGER.indexOf(i);
          const u = UNFOLD[i];
          return (
            <motion.div
              key={i}
              initial={{
                rotateX: u.rx,
                rotateY: u.ry,
                z: u.tz,
                scale: 0.2,
                opacity: 0,
              }}
              animate={{ rotateX: 0, rotateY: 0, z: 0, scale: 1, opacity: 1 }}
              exit={{
                rotateX: u.rx,
                rotateY: u.ry,
                z: u.tz,
                scale: 0.15,
                opacity: 0,
              }}
              transition={{
                delay: order * 0.055,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                background: hexToRgba(accent, 0.025),
                border: `1px solid ${hexToRgba(accent, 0.07)}`,
                boxShadow: `inset 0 0 40px ${hexToRgba(accent, 0.03)}`,
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
              }}
            />
          );
        })}
      </div>

      {/* Content — fades in after panels settle, with camera push */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ delay: 0.55, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '9vh 6vw',
          overflowY: 'auto',
          cursor: 'default',
        }}
      >
        <div
          style={{
            maxWidth: 960,
            width: '100%',
            position: 'relative',
            color: '#F5F5F5',
          }}
        >
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: -20,
              right: -8,
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: hexToRgba(accent, 0.06),
              border: `1px solid ${hexToRgba(accent, 0.22)}`,
              color: hexToRgba(accent, 0.85),
              cursor: 'pointer',
              ...mono,
              fontSize: 16,
              borderRadius: 6,
              transition: 'all 0.2s ease',
            }}
            aria-label="Close"
          >
            ✕
          </button>

          {/* Chapter metadata strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginBottom: 18,
            }}
          >
            <span
              style={{
                ...mono,
                fontSize: 10,
                letterSpacing: '0.3em',
                color: hexToRgba(accent, 0.6),
              }}
            >
              CH.{data.number}
            </span>
            <div
              style={{
                width: 60,
                height: 1,
                background: `linear-gradient(90deg, ${hexToRgba(accent, 0.5)}, transparent)`,
              }}
            />
            <span
              style={{
                ...mono,
                fontSize: 9,
                letterSpacing: '0.25em',
                color: hexToRgba(accent, 0.35),
              }}
            >
              DEEP DIVE
            </span>
          </div>

          <h2
            style={{
              ...mono,
              fontSize: 'clamp(40px, 6.4vw, 64px)',
              fontWeight: 700,
              marginBottom: 22,
              lineHeight: 1,
              letterSpacing: '0.04em',
              color: accent,
              textShadow: `0 0 44px ${hexToRgba(accent, 0.45)}`,
            }}
          >
            {data.title}
          </h2>

          <div
            style={{
              width: 100,
              height: 1,
              marginBottom: 40,
              background: `linear-gradient(90deg, ${hexToRgba(accent, 0.5)}, transparent)`,
            }}
          />

          <ChapterBody data={data} onOpenProject={onOpenProject} />
        </div>
      </motion.div>

      {/* Bottom close hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 1.0 }}
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          ...mono,
          fontSize: 9,
          letterSpacing: '0.28em',
          color: hexToRgba(accent, 0.4),
          pointerEvents: 'none',
        }}
      >
        [ CLICK OUTSIDE · ESC TO CLOSE ]
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Corner brackets — HUD frame
// ---------------------------------------------------------------------------
function CornerBrackets({ accent }: { accent: string }) {
  const stroke = hexToRgba(accent, 0.45);
  const size = 38;
  const inset = 20;
  const corners = [
    { top: inset, left: inset, rotate: 0 },
    { top: inset, right: inset, rotate: 90 },
    { bottom: inset, right: inset, rotate: 180 },
    { bottom: inset, left: inset, rotate: 270 },
  ];
  return (
    <>
      {corners.map((c, i) => (
        <motion.svg
          key={i}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 + i * 0.04, duration: 0.5 }}
          width={size}
          height={size}
          viewBox="0 0 38 38"
          style={{
            position: 'absolute',
            ...c,
            transform: `rotate(${c.rotate}deg)`,
            pointerEvents: 'none',
          }}
        >
          <path
            d="M 1 14 L 1 1 L 14 1"
            fill="none"
            stroke={stroke}
            strokeWidth={1.25}
          />
        </motion.svg>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Chapter-specific content
// ---------------------------------------------------------------------------

function ChapterBody({
  data,
  onOpenProject,
}: {
  data: CubeChapterData;
  onOpenProject: (id: string) => void;
}) {
  const accent = data.accent;

  // Work sub-faces route into the same deep-dive panel as the generic work
  // chapter — the projects list. (Clicking the cube while it's locked on a
  // specific project is already handled upstream as a direct jump, but we
  // keep this fallback safe.)
  const effectiveId =
    data.id === 'work-titan' || data.id === 'work-campus' || data.id === 'work-genx'
      ? 'work'
      : data.id;

  switch (effectiveId) {
    case 'origin':
      return (
        <div>
          <p
            style={{
              ...mono,
              fontSize: 15,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.9,
              marginBottom: 32,
            }}
          >
            Developer, founder, and B.Tech CS student at RVCE Bangalore. I build
            and ship products using AI-assisted development — from mobile apps
            to AI platforms to physical hardware businesses.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
            }}
          >
            {[
              { n: '3', l: 'PRODUCTS SHIPPED' },
              { n: '20+', l: 'BETA USERS' },
              { n: '4TH', l: 'SEMESTER' },
            ].map((s) => (
              <div
                key={s.l}
                style={{
                  textAlign: 'center',
                  padding: '24px 12px',
                  background: hexToRgba(accent, 0.04),
                  border: `1px solid ${hexToRgba(accent, 0.14)}`,
                }}
              >
                <div
                  style={{
                    ...mono,
                    fontSize: 32,
                    fontWeight: 700,
                    color: '#F5F5F5',
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    ...mono,
                    fontSize: 9,
                    color: hexToRgba(accent, 0.6),
                    marginTop: 8,
                    letterSpacing: '0.18em',
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'stack':
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 32,
          }}
        >
          {Object.entries(SKILLS).map(([cat, skills]) => (
            <div key={cat}>
              <h3
                style={{
                  ...mono,
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  color: accent,
                  fontWeight: 600,
                  marginBottom: 14,
                  paddingBottom: 10,
                  borderBottom: `1px solid ${hexToRgba(accent, 0.22)}`,
                }}
              >
                {cat}
              </h3>
              {skills.map((s) => (
                <div
                  key={s}
                  style={{
                    ...mono,
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.55)',
                    marginBottom: 8,
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          ))}
        </div>
      );

    case 'work':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p
            style={{
              ...mono,
              fontSize: 13,
              color: 'rgba(255,255,255,0.48)',
              marginBottom: 12,
              letterSpacing: '0.04em',
            }}
          >
            Click any project to enter its dedicated environment.
          </p>
          {PROJECTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onOpenProject(p.id)}
              style={{
                textAlign: 'left',
                padding: 22,
                background: hexToRgba(accent, 0.03),
                border: `1px solid ${hexToRgba(accent, 0.12)}`,
                cursor: 'pointer',
                color: 'inherit',
                fontFamily: 'inherit',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = hexToRgba(accent, 0.07);
                e.currentTarget.style.borderColor = hexToRgba(accent, 0.3);
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = hexToRgba(accent, 0.03);
                e.currentTarget.style.borderColor = hexToRgba(accent, 0.12);
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: p.statusColor,
                      boxShadow: `0 0 8px ${p.statusColor}`,
                    }}
                  />
                  <h3
                    style={{
                      ...mono,
                      fontSize: 15,
                      fontWeight: 700,
                      color: '#F5F5F5',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {p.title}
                  </h3>
                </div>
                <span
                  style={{
                    ...mono,
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    color: hexToRgba(accent, 0.75),
                  }}
                >
                  ENTER →
                </span>
              </div>
              <p
                style={{
                  ...mono,
                  fontSize: 12,
                  color: hexToRgba(accent, 0.6),
                  letterSpacing: '0.06em',
                }}
              >
                {p.subtitle}
              </p>
              <p
                style={{
                  ...mono,
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.45)',
                  lineHeight: 1.7,
                }}
              >
                {p.description}
              </p>
            </button>
          ))}
        </div>
      );

    case 'arena': {
      const a = ACHIEVEMENTS[0];
      return (
        <div>
          <div
            style={{
              padding: 28,
              background: hexToRgba(accent, 0.04),
              border: `1px solid ${hexToRgba(accent, 0.18)}`,
              marginBottom: 16,
            }}
          >
            <h3
              style={{
                ...mono,
                fontSize: 14,
                fontWeight: 700,
                color: hexToRgba(accent, 0.9),
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 8,
              }}
            >
              {a.title}
            </h3>
            <p
              style={{
                ...mono,
                fontSize: 13,
                color: hexToRgba(accent, 0.6),
                marginBottom: 14,
              }}
            >
              {a.subtitle}
            </p>
            <p
              style={{
                ...mono,
                fontSize: 14,
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.8,
                marginBottom: 14,
              }}
            >
              {a.description}
            </p>
            <p
              style={{
                ...mono,
                fontSize: 11,
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              {a.journey}
            </p>
            <p
              style={{
                ...mono,
                fontSize: 11,
                color: hexToRgba(accent, 0.45),
                marginTop: 10,
              }}
            >
              {a.date}
            </p>
          </div>
          <div
            style={{
              padding: 24,
              background: hexToRgba(accent, 0.025),
              border: `1px solid ${hexToRgba(accent, 0.1)}`,
            }}
          >
            <h3
              style={{
                ...mono,
                fontSize: 13,
                fontWeight: 700,
                color: '#F5F5F5',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 6,
              }}
            >
              {EDUCATION.institution}
            </h3>
            <p style={{ ...mono, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
              {EDUCATION.degree}
            </p>
            <p
              style={{
                ...mono,
                fontSize: 11,
                color: 'rgba(255,255,255,0.35)',
                marginTop: 4,
              }}
            >
              {EDUCATION.semester} · {EDUCATION.years}
            </p>
          </div>
        </div>
      );
    }

    case 'signal':
      return (
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              ...mono,
              fontSize: 15,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.9,
              marginBottom: 36,
            }}
          >
            Open to projects, collaborations, and conversations about building
            things that matter.
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            {[
              { label: 'GITHUB', href: CONTACT.github, Icon: Code2 },
              { label: 'EMAIL', href: '#', Icon: Mail },
              { label: 'LINKEDIN', href: '#', Icon: ExternalLink },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  ...mono,
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  color: hexToRgba(accent, 0.85),
                  textDecoration: 'none',
                  padding: '16px 30px',
                  border: `1px solid ${hexToRgba(accent, 0.24)}`,
                  background: hexToRgba(accent, 0.04),
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.25s ease',
                }}
              >
                <l.Icon size={14} />
                {l.label}
              </a>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}
