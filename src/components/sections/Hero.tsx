'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { scrollToProgress } from '@/lib/smoothScroll';

// Vengeance-framer inspired hero: left-aligned content column, massive
// two-line split headline with bright first line + muted second line,
// primary blue CTA + dark-pill secondary, stats row pinned to the bottom
// of the 100vh frame. Cube behaviour is untouched — it rises from the
// viewport bottom (useCubeMotion) independent of anything in this file.

const STATS = [
  { value: '20+', label: 'beta users' },
  { value: '3', label: 'products shipped' },
  { value: '4th', label: 'semester, RVCE' },
];

interface HeroProps {
  /** Gate the stagger animation on the loader completion so the hero
   *  text entrance is simultaneous with the cube's emergence. Defaults
   *  to true so the component still works standalone (e.g. in tests). */
  ready?: boolean;
}

export default function Hero({ ready = true }: HeroProps) {
  const handleViewWork = () => scrollToProgress(0.34);
  const handleContact = () => scrollToProgress(0.92);

  return (
    <section
      id="hero"
      className="relative px-6 md:px-10 lg:px-16"
      style={{
        minHeight: '100vh',
        maxWidth: 1440,
        margin: '0 auto',
      }}
    >
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate={ready ? 'animate' : 'initial'}
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 'clamp(108px, 20vh, 220px)',
          paddingBottom: 'clamp(40px, 6vh, 80px)',
        }}
      >
        {/* Location */}
        <motion.div
          variants={staggerItem}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 24,
            color: 'rgba(245, 245, 245, 0.6)',
            width: 'fit-content',
          }}
        >
          <MapPin size={14} strokeWidth={2} />
          <span
            style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Bangalore
          </span>
        </motion.div>

        {/* Split headline — Inter Bold. Clean geometric sans per the
            supplied font reference; the HUD cube no longer needs its
            sci-fi headline companion now that the cube itself carries
            the tech language and the headline gets to speak plainly.
            Inter renders wider than the old Chakra Petch at the same
            nominal size, so the clamp max is reduced (108 vs 132) and
            the max-width is tightened to 60% of the content column to
            keep the copy clear of the cube anchored on the right. */}
        <motion.h1
          variants={staggerItem}
          style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: 'clamp(44px, 7.2vw, 108px)',
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            maxWidth: '60%',
            marginBottom: 36,
          }}
        >
          <span style={{ color: '#F5F5F5' }}>Student by day,</span>
          <br />
          <span style={{ color: '#7A7A7A' }}>Builder by night</span>
        </motion.h1>

        {/* Buttons */}
        <motion.div
          variants={staggerItem}
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={handleViewWork}
            style={{
              padding: '13px 26px',
              borderRadius: 10,
              border: '1px solid transparent',
              background: '#4A9EFF',
              color: '#0A0A0A',
              cursor: 'pointer',
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              boxShadow:
                '0 0 44px rgba(74, 158, 255, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.22)',
              transition:
                'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow =
                '0 0 56px rgba(74, 158, 255, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.28)';
              e.currentTarget.style.background = '#5FA8FF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 0 44px rgba(74, 158, 255, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.22)';
              e.currentTarget.style.background = '#4A9EFF';
            }}
          >
            View work
          </button>

          <button
            type="button"
            onClick={handleContact}
            style={{
              padding: '13px 26px',
              borderRadius: 10,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(20, 22, 28, 0.8)',
              color: '#F5F5F5',
              cursor: 'pointer',
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transition: 'border-color 0.2s ease, background 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
              e.currentTarget.style.background = 'rgba(30, 34, 44, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.background = 'rgba(20, 22, 28, 0.8)';
            }}
          >
            Get in touch
          </button>
        </motion.div>

        {/* Spacer pushes stats to the bottom of the 100vh frame */}
        <div style={{ flex: 1 }} />

        {/* Stats — three compact columns capped to the left third of the
            viewport so the cube (centred at x=50%, bottom-anchored on
            first paint) has clear air around it during the rise. */}
        <motion.div
          variants={staggerItem}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'clamp(14px, 2vw, 28px)',
            maxWidth: 440,
          }}
        >
          {STATS.map((s) => (
            <div key={s.value}>
              <div
                className="font-display"
                style={{
                  fontSize: 'clamp(26px, 3vw, 42px)',
                  fontWeight: 500,
                  letterSpacing: '-0.025em',
                  color: '#F5F5F5',
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {s.value}
              </div>
              <div
                className="font-sans"
                style={{
                  fontSize: 13,
                  lineHeight: 1.4,
                  color: 'rgba(245, 245, 245, 0.5)',
                  whiteSpace: 'pre-line',
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
