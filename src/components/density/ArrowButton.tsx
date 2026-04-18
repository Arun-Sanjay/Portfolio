"use client";

import { useState } from "react";

interface ArrowButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export default function ArrowButton({
  children,
  href,
  onClick,
  variant = "primary",
}: ArrowButtonProps) {
  const [hovered, setHovered] = useState(false);

  const isPrimary = variant === "primary";

  const sharedStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 28px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.10)",
    background: "transparent",
    color: isPrimary ? "#F5F5F5" : "#7A7A7A",
    cursor: "pointer",
    textDecoration: "none",
    transition: "border-color 0.2s ease, color 0.2s ease",
    borderColor: hovered
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(255, 255, 255, 0.10)",
  };

  const content = (
    <>
      <span className="font-mono text-[12px] uppercase tracking-[0.12em]">
        {children}
      </span>
      <span
        className="inline-block text-[14px] transition-transform duration-200"
        style={{
          transform: hovered ? "rotate(45deg)" : "rotate(0deg)",
        }}
      >
        &#8599;
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        style={sharedStyles}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      style={sharedStyles}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {content}
    </button>
  );
}
