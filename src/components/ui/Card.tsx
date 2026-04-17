"use client";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gold?: boolean;
}

export default function Card({ children, className = "", gold = false }: CardProps) {
  const borderColor = gold
    ? "rgba(201,168,76,0.15)"
    : "rgba(255,255,255,0.06)";
  const hoverBorder = gold
    ? "rgba(201,168,76,0.25)"
    : "rgba(255,255,255,0.1)";

  return (
    <div
      style={{
        background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.005) 100%)",
        backdropFilter: "blur(16px)",
        border: `1px solid ${borderColor}`,
        borderRadius: 12,
        padding: "24px",
        transition: "all 0.4s ease",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
      className={className}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = hoverBorder;
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = borderColor;
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)";
      }}
    >
      {children}
    </div>
  );
}
