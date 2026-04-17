"use client";

interface GlowTextProps {
  children: React.ReactNode;
  metal?: boolean;
}

export default function GlowText({ children, metal = true }: GlowTextProps) {
  if (metal) {
    return <span className="liquid-metal">{children}</span>;
  }
  return <span className="text-glow">{children}</span>;
}
