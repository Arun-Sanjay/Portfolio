"use client";

interface ProcessIndicatorProps {
  steps: Array<{
    label: string;
    status: "red" | "yellow" | "green" | "accent";
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  red: "#FF4444",
  yellow: "#FFB800",
  green: "#22C55E",
  accent: "#4A9EFF",
};

export default function ProcessIndicator({ steps }: ProcessIndicatorProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {steps.map((step, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="flex items-center gap-1.5">
            <span
              className="w-[6px] h-[6px] rounded-full shrink-0"
              style={{ background: STATUS_COLORS[step.status] }}
            />
            <span
              className="font-mono text-[11px] uppercase tracking-[0.08em]"
              style={{ color: "#C5C5C5" }}
            >
              {step.label}
            </span>
          </span>
          {i < steps.length - 1 && (
            <span
              className="font-mono text-[11px]"
              style={{ color: "#4A4A4A" }}
            >
              &#8594;
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
