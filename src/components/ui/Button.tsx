"use client";

import { useState } from "react";

interface ButtonProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export default function Button({ variant = "primary", children, href, onClick }: ButtonProps) {
  const [hovered, setHovered] = useState(false);

  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "15px 36px",
    fontFamily: "var(--font-inter)",
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: "0.02em",
    borderRadius: 50,
    cursor: "pointer",
    transition: "all 0.35s ease",
    textDecoration: "none",
  };

  const styles = variant === "primary"
    ? {
        ...base,
        background: hovered ? "rgba(255,255,255,0.9)" : "#fff",
        color: "#000",
        border: "1px solid rgba(255,255,255,0.9)",
        boxShadow: hovered ? "0 0 30px rgba(255,255,255,0.15)" : "none",
      }
    : {
        ...base,
        background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: hovered ? "0 0 20px rgba(255,255,255,0.05)" : "none",
      };

  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  if (href) {
    return (
      <a href={href} style={styles} target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined} {...handlers}>
        {children}
      </a>
    );
  }
  return <button onClick={onClick} style={styles} {...handlers}>{children}</button>;
}
