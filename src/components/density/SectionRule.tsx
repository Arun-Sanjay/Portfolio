"use client";

interface SectionRuleProps {
  active?: boolean;
}

export default function SectionRule({ active = false }: SectionRuleProps) {
  return (
    <div className="relative my-8 w-full flex items-center">
      <span
        className="absolute left-0 w-[6px] h-[6px] rounded-full shrink-0 -translate-y-px"
        style={{ background: active ? "#4A9EFF" : "#4A4A4A" }}
      />
      <div
        className="w-full h-px ml-4"
        style={{ background: "rgba(255, 255, 255, 0.06)" }}
      />
    </div>
  );
}
