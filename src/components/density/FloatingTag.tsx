"use client";

interface FloatingTagProps {
  children: React.ReactNode;
  variant?: "default" | "live" | "new";
}

export default function FloatingTag({
  children,
  variant = "default",
}: FloatingTagProps) {
  const isLive = variant === "live";
  const isNew = variant === "new";

  return (
    <>
      {isLive && (
        <style jsx global>{`
          @keyframes livePulse {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.4;
            }
          }
        `}</style>
      )}
      <span
        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] rounded-sm"
        style={{
          padding: "4px 10px",
          border: `1px solid ${
            isNew ? "#4A9EFF" : "rgba(255, 255, 255, 0.06)"
          }`,
          color: isNew ? "#4A9EFF" : "#7A7A7A",
        }}
      >
        {isLive && (
          <span
            className="w-[5px] h-[5px] rounded-full shrink-0"
            style={{
              background: "#22C55E",
              animation: "livePulse 2s ease-in-out infinite",
            }}
          />
        )}
        {children}
      </span>
    </>
  );
}
