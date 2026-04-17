'use client';

import { useState } from 'react';
import { Code2, Mail, ExternalLink, type LucideIcon } from 'lucide-react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { CONTACT } from '@/lib/constants';

function ContactRow({
  icon: Icon,
  label,
  handle,
  href,
}: {
  icon: LucideIcon;
  label: string;
  handle: string;
  href: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative block"
      style={{
        padding: '12px 16px',
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.06)',
        background: hovered ? '#121316' : '#0F1012',
        borderColor: hovered ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.06)',
        textDecoration: 'none',
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateX(6px)' : 'translateX(0)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <Icon size={15} color={hovered ? '#F5F5F5' : '#7A7A7A'} style={{ transition: 'color 0.25s' }} />
      <div style={{ flex: 1 }}>
        <div
          className="font-mono"
          style={{
            fontSize: 9,
            letterSpacing: '0.28em',
            color: '#7A7A7A',
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        <div
          className="font-mono"
          style={{
            fontSize: 12,
            color: '#F5F5F5',
            letterSpacing: '-0.005em',
          }}
        >
          {handle}
        </div>
      </div>
      <span
        className="font-mono transition-transform"
        style={{
          fontSize: 12,
          color: hovered ? '#F5F5F5' : '#4A4A4A',
          transform: hovered ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'all 0.25s ease',
        }}
      >
        &#x2197;
      </span>
    </a>
  );
}

function smoothstep(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

// Signal scroll choreography (cube spline + chapter range 0.80 – 1.00):
//   0.80 → 0.88   ENTER  cube migrates right and STAYS LARGE; left text
//                          column slides in from the left.
//   0.88 → 1.00   DWELL  contact panel + footer all visible together with
//                          the giant right-side cube as the visual lock.
const ENTER_START = 0.80;
const ENTER_END = 0.88;

const STAGGER_STEP = 0.005;

export default function Signal() {
  const progress = useScrollProgress();

  const cellProgress = (i: number) => {
    const stagger = i * STAGGER_STEP;
    return smoothstep(
      (progress - (ENTER_START + stagger)) / (ENTER_END - ENTER_START)
    );
  };

  const leftStyle = (i: number): React.CSSProperties => {
    const p = cellProgress(i);
    return {
      opacity: p,
      transform: `translateX(${(1 - p) * -80}px)`,
      willChange: 'transform, opacity',
    };
  };

  return (
    <section
      id="signal"
      className="relative"
      style={{
        // 220vh wrapper covers global progress 0.80 → 1.00 (~20% of total).
        // Sticky inner pins the giant-cube + contact frame so the user
        // sees the contact panel and the cube together for the entire
        // chapter — matching the user's request that this final screen
        // showcase a much bigger cube than before.
        height: '220vh',
      }}
    >
      <div
        className="sticky top-0 px-6 md:px-10 lg:px-16"
        style={{
          height: '100vh',
          maxWidth: 1440,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Tighter 7 + 5 grid — text column on the LEFT, cube reservation
            on the RIGHT. Cube sits at xFrac 0.28 with a much larger scale
            (~1.40), so the right column reservation accounts for that. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          {/* LEFT — heading + subtitle + contact rows + meta. */}
          <div className="lg:col-span-6 flex flex-col">
            <div
              className="flex items-center gap-3"
              style={{ marginBottom: 18, ...leftStyle(0) }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.35em',
                  color: '#4A4A4A',
                }}
              >
                /05
              </span>
              <span
                style={{
                  width: 24,
                  height: 1,
                  background: '#4A4A4A',
                  display: 'inline-block',
                }}
              />
              <span
                className="font-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.35em',
                  color: '#7A7A7A',
                }}
              >
                SIGNAL
              </span>
            </div>

            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(34px, 4vw, 60px)',
                fontWeight: 500,
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
                color: '#F5F5F5',
                ...leftStyle(1),
              }}
            >
              Let&apos;s build
              <br />
              <span style={{ color: '#8A8A8A' }}>something.</span>
            </h2>

            <p
              className="font-sans"
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: '#9A9A9A',
                marginTop: 14,
                marginBottom: 22,
                maxWidth: 460,
                ...leftStyle(2),
              }}
            >
              Open to interesting projects, collaborations, and conversations.
              Reply within 24 hours.
            </p>

            <div className="flex flex-col gap-2" style={{ maxWidth: 460 }}>
              <div style={leftStyle(3)}>
                <ContactRow
                  icon={Code2}
                  label="GITHUB"
                  handle="github.com/Arun-Sanjay"
                  href={CONTACT.github}
                />
              </div>
              <div style={leftStyle(4)}>
                <ContactRow
                  icon={Mail}
                  label="EMAIL"
                  handle={CONTACT.email || 'hello@arunsanjay.dev'}
                  href={`mailto:${CONTACT.email || 'hello@arunsanjay.dev'}`}
                />
              </div>
              <div style={leftStyle(5)}>
                <ContactRow
                  icon={ExternalLink}
                  label="LINKEDIN"
                  handle={CONTACT.linkedin || 'linkedin.com/in/arunsanjay'}
                  href={
                    CONTACT.linkedin || 'https://linkedin.com/in/arunsanjay'
                  }
                />
              </div>
            </div>

            <div
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: '0.2em',
                color: '#4A4A4A',
                marginTop: 14,
                ...leftStyle(6),
              }}
            >
              IST (UTC+5:30) · AVAILABLE
            </div>

            {/* Footer pinned to the bottom of the left column so the page
                ends with a proper signature beside the giant cube. */}
            <div
              className="flex flex-wrap items-center gap-x-5 gap-y-1"
              style={{
                marginTop: 28,
                paddingTop: 16,
                borderTop: '1px solid rgba(255,255,255,0.06)',
                ...leftStyle(7),
              }}
            >
              <span
                className="font-mono"
                style={{ fontSize: 9, color: '#4A4A4A', letterSpacing: '0.16em' }}
              >
                © 2026 · S ARUN SANJAY · BANGALORE
              </span>
              <span
                className="font-mono"
                style={{ fontSize: 9, color: '#4A4A4A', letterSpacing: '0.16em' }}
              >
                BUILT WITH NEXT.JS · FRAMER MOTION
              </span>
            </div>
          </div>

          {/* RIGHT — reserved cube zone. Cube sits here at scale ≈ 1.40
              (matching/exceeding Arena) and the text never crosses into
              this column. */}
          <div
            aria-hidden="true"
            className="hidden lg:block lg:col-span-6"
            style={{ minHeight: 480 }}
          />
        </div>
      </div>
    </section>
  );
}
