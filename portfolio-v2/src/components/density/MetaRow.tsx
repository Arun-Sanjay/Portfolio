"use client";

interface MetaRowProps {
  items: string[];
}

export default function MetaRow({ items }: MetaRowProps) {
  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2.5">
          <span
            className="font-mono text-[12px] uppercase tracking-[0.08em]"
            style={{ color: "#7A7A7A" }}
          >
            {item}
          </span>
          {i < items.length - 1 && (
            <span
              className="text-[8px]"
              style={{ color: "#4A4A4A" }}
            >
              &#x2022;
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
