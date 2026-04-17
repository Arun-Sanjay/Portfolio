"use client";

export default function ScrollIndicator() {
  return (
    <>
      <style jsx global>{`
        @keyframes scrollBarSlide {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(16px);
            opacity: 0;
          }
        }
      `}</style>
      <div className="flex flex-col items-center gap-2">
        <span
          className="font-mono text-[9px] uppercase tracking-[0.15em]"
          style={{ color: "#4A4A4A" }}
        >
          SCROLL
        </span>
        <div
          className="relative overflow-hidden"
          style={{ width: "2px", height: "20px" }}
        >
          <div
            className="absolute top-0 left-0 w-full"
            style={{
              height: "8px",
              background: "#4A4A4A",
              borderRadius: "1px",
              animation: "scrollBarSlide 1.8s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </>
  );
}
