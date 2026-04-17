"use client";

interface StatBlockProps {
  stats: Array<{ value: string; label: string }>;
}

export default function StatBlock({ stats }: StatBlockProps) {
  return (
    <div className="grid grid-cols-3 w-full">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex flex-col items-center text-center px-4"
          style={{
            borderRight:
              i < stats.length - 1
                ? "1px solid rgba(255, 255, 255, 0.06)"
                : "none",
          }}
        >
          <span
            className="font-display font-medium leading-none"
            style={{
              color: "#F5F5F5",
              fontSize: "clamp(32px, 5vw, 56px)",
              letterSpacing: "-0.03em",
              lineHeight: "0.95",
            }}
          >
            {stat.value}
          </span>
          <span
            className="font-mono text-[10px] uppercase tracking-[0.15em] mt-3"
            style={{ color: "#7A7A7A" }}
          >
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
