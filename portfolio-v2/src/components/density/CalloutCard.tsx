"use client";

interface CalloutCardProps {
  icon?: string;
  text: string;
  className?: string;
}

export default function CalloutCard({
  icon,
  text,
  className = "",
}: CalloutCardProps) {
  return (
    <div
      className={`flex items-start gap-2.5 rounded-lg max-w-[220px] ${className}`}
      style={{
        background: "#111111",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        padding: "12px 16px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      {icon && <span className="text-sm leading-none shrink-0">{icon}</span>}
      <span
        className="font-mono text-[12px] leading-relaxed"
        style={{ color: "#7A7A7A" }}
      >
        {text}
      </span>
    </div>
  );
}
