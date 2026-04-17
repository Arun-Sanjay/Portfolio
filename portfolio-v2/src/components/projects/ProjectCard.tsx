'use client';

import type { PROJECTS } from '@/lib/constants';
import { openProject } from '@/lib/projectOverlay';

type Project = (typeof PROJECTS)[number];

function getProjectStats(
  project: Project
): Array<{ value: string; label: string }> {
  switch (project.id) {
    case 'titan':
      return [
        { value: '20+', label: 'BETA' },
        { value: 'ANDROID', label: 'PLATFORM' },
        { value: '2026', label: 'LAUNCHED' },
      ];
    case 'campusiq':
      return [
        { value: '26', label: 'FEATURES' },
        { value: 'RAG', label: 'PIPELINE' },
        { value: '2025', label: 'STARTED' },
      ];
    case 'genx':
      return [
        { value: 'SP RD', label: 'SOURCING' },
        { value: 'E2E', label: 'SERVICE' },
        { value: '2025', label: 'STARTED' },
      ];
    default:
      return [];
  }
}

function getProjectTags(project: Project): string[] {
  if (project.stack.length > 0) return [...project.stack];
  if ('tags' in project && project.tags) return [...project.tags];
  return [];
}

interface Props {
  project: Project;
  /** 0..1 reveal progress. 0 = hidden + shifted, 1 = settled. */
  reveal?: number;
  /** 0..1 focus state. 1 = cube is currently ticked to this card. */
  focus?: number;
}

// Full-size project card — used in Work as one card per dedicated sticky
// frame, so it can carry generous typography, full description, stat row,
// tech strip, and CTA without cramping.
export default function ProjectCard({ project, reveal = 1, focus = 0 }: Props) {
  const stats = getProjectStats(project);
  const tags = getProjectTags(project);

  const handleOpen = () => openProject(project.id);

  // Card-level entrance — slides in from the left as the cube ticks to
  // this project on the right.
  const tx = (1 - reveal) * -40;
  const ty = (1 - reveal) * 30;
  const opacity = reveal;

  // Focus accent — when the cube is locked on this card, border brightens.
  const focusBorder = `rgba(255,255,255,${0.08 + focus * 0.16})`;
  const focusBackground = focus > 0.2 ? '#121316' : '#0F1012';
  const focusLift = -focus * 4;

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="text-left w-full group"
      style={{
        background: focusBackground,
        border: `1px solid ${focusBorder}`,
        padding: '28px 32px',
        borderRadius: 14,
        cursor: 'pointer',
        opacity,
        transform: `translate(${tx}px, ${ty + focusLift}px)`,
        transition:
          'border-color 0.25s ease, background 0.25s ease',
        willChange: 'transform, opacity',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
        e.currentTarget.style.background = '#141519';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = focusBorder;
        e.currentTarget.style.background = focusBackground;
      }}
    >
      {/* Top row: number + year */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 14 }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: '0.32em',
            color: focus > 0.3 ? '#4A9EFF' : '#4A4A4A',
            transition: 'color 0.25s ease',
          }}
        >
          /{project.number}
        </span>
        <span
          className="font-mono"
          style={{ fontSize: 11, color: '#4A4A4A', letterSpacing: '0.12em' }}
        >
          {project.year}
        </span>
      </div>

      {/* Title + status */}
      <div className="flex items-start justify-between gap-4">
        <h3
          className="font-display"
          style={{
            fontSize: 'clamp(26px, 2.4vw, 36px)',
            fontWeight: 500,
            color: '#F5F5F5',
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
          }}
        >
          {project.title}
        </h3>
        <span
          className="flex items-center gap-1.5 shrink-0"
          style={{ marginTop: 6 }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: project.statusColor,
              boxShadow:
                focus > 0.3 ? `0 0 10px ${project.statusColor}` : 'none',
              transition: 'box-shadow 0.25s ease',
            }}
          />
          <span
            className="font-mono"
            style={{
              fontSize: 9,
              letterSpacing: '0.2em',
              color: project.statusColor,
            }}
          >
            {project.status}
          </span>
        </span>
      </div>

      {/* Subtitle */}
      <p
        className="font-mono"
        style={{
          fontSize: 12,
          color: '#7A7A7A',
          letterSpacing: '0.04em',
          marginTop: 8,
        }}
      >
        {project.subtitle}
      </p>

      {/* Description */}
      <p
        className="font-sans"
        style={{
          fontSize: 15,
          lineHeight: 1.6,
          color: '#C5C5C5',
          marginTop: 18,
        }}
      >
        {project.description}
      </p>

      {/* Stat row — 3 compact columns */}
      {stats.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
            marginTop: 22,
            paddingTop: 18,
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                paddingLeft: i === 0 ? 0 : 16,
                borderLeft:
                  i === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div
                className="font-mono"
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: '#F5F5F5',
                  letterSpacing: '-0.01em',
                }}
              >
                {s.value}
              </div>
              <div
                className="font-mono"
                style={{
                  fontSize: 9,
                  color: '#7A7A7A',
                  letterSpacing: '0.22em',
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tech strip */}
      {tags.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px 14px',
            marginTop: 18,
          }}
        >
          {tags.map((t) => (
            <span
              key={t}
              className="font-mono"
              style={{
                fontSize: 10,
                color: '#7A7A7A',
                letterSpacing: '0.14em',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Enter cue */}
      <div
        className="flex items-center justify-between"
        style={{
          marginTop: 22,
          paddingTop: 16,
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            color: focus > 0.3 ? '#F5F5F5' : '#7A7A7A',
            letterSpacing: '0.28em',
            transition: 'color 0.25s ease',
          }}
        >
          EXPLORE PROJECT
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: 14,
            color: focus > 0.3 ? '#4A9EFF' : '#C5C5C5',
            transform: focus > 0.3 ? 'translateX(3px)' : 'translateX(0)',
            transition: 'color 0.25s ease, transform 0.25s ease',
          }}
        >
          &#x2197;
        </span>
      </div>
    </button>
  );
}
