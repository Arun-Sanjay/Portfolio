"use client";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-white/60 border border-white/[0.08] rounded-[4px] ${className}`}
    >
      {children}
    </span>
  );
}
