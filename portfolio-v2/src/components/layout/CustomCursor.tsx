"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia("(pointer: fine)");
    setIsMobile(!mql.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(!e.matches);
    };
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

      if (!visible) setVisible(true);

      const target = e.target as HTMLElement;
      const hasCursorAttr = target.closest("[data-cursor='pointer']");
      const isInteractive = target.closest(
        "a, button, [role='button'], input, textarea, select, label"
      );
      setIsPointer(!!(hasCursorAttr || isInteractive));
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isMobile, visible]);

  if (isMobile) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{
        mixBlendMode: "difference",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.15s ease",
      }}
    >
      <div
        style={{
          width: isPointer ? 40 : 8,
          height: isPointer ? 40 : 8,
          borderRadius: "50%",
          border: `1px solid #4A9EFF`,
          background: isPointer ? "transparent" : "rgba(74, 158, 255, 0.15)",
          transform: "translate(-50%, -50%)",
          transition:
            "width 0.2s cubic-bezier(0, 0, 0.2, 1), height 0.2s cubic-bezier(0, 0, 0.2, 1), background 0.2s ease",
        }}
      />
    </div>
  );
}
