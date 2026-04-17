"use client";

interface LogoStripProps {
  items: string[];
  separator?: string;
}

export default function LogoStrip({
  items,
  separator = "\u00B7",
}: LogoStripProps) {
  return (
    <div className="overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-3 whitespace-nowrap py-1">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-3">
            <span
              className="font-mono text-[11px] uppercase tracking-[0.12em]"
              style={{ color: "#4A4A4A" }}
            >
              {item}
            </span>
            {i < items.length - 1 && (
              <span
                className="text-[11px]"
                style={{ color: "#4A4A4A" }}
              >
                {separator}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
