"use client";

interface NumberedLabelProps {
  number: string;
  label: string;
  accent?: boolean;
}

export default function NumberedLabel({
  number,
  label,
  accent = false,
}: NumberedLabelProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="font-mono text-[10px]"
        style={{ color: accent ? "#4A9EFF" : "#7A7A7A" }}
      >
        {number}
      </span>
      <span
        className="w-10 h-px"
        style={{ background: "rgba(255, 255, 255, 0.06)" }}
      />
      <span
        className="font-mono text-[10px] uppercase tracking-[0.15em]"
        style={{ color: "#7A7A7A" }}
      >
        {label}
      </span>
    </div>
  );
}
