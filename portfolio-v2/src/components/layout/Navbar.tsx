"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Layers,
  Briefcase,
  Trophy,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { useChapter } from "@/hooks/useChapter";
import { scrollToProgress } from "@/lib/smoothScroll";

// Matches the Vengeance-framer reference: a single centred pill that holds
// brand + chapter destinations, each with an outline icon beside a
// sentence-case label. Active state highlights the current chapter.
const NAV_LINKS: Array<{
  label: string;
  chapterId: string;
  icon: LucideIcon;
}> = [
  { label: "Arun Sanjay", chapterId: "origin", icon: Home },
  { label: "Stack", chapterId: "stack", icon: Layers },
  { label: "Work", chapterId: "work", icon: Briefcase },
  { label: "Arena", chapterId: "arena", icon: Trophy },
  { label: "Contact", chapterId: "signal", icon: MessageCircle },
];

const CHAPTER_PROGRESS: Record<string, number> = {
  origin: 0,
  stack: 0.22,
  work: 0.34,
  arena: 0.74,
  signal: 0.92,
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentChapter = useChapter();

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = (chapterId: string) => {
    scrollToProgress(CHAPTER_PROGRESS[chapterId] ?? 0);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop — centered pill */}
      <nav
        className="fixed top-6 left-1/2 z-50 hidden md:flex -translate-x-1/2 items-center"
        aria-label="Primary"
      >
        <div
          className="flex items-center gap-1"
          style={{
            padding: "8px",
            borderRadius: 999,
            background: "rgba(14, 16, 22, 0.78)",
            border: "1px solid rgba(255, 255, 255, 0.07)",
            boxShadow:
              "0 14px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px) saturate(1.3)",
            WebkitBackdropFilter: "blur(20px) saturate(1.3)",
          }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = currentChapter.id === link.chapterId;
            const Icon = link.icon;
            return (
              <button
                key={link.chapterId}
                onClick={() => handleNavClick(link.chapterId)}
                className="relative inline-flex items-center gap-2.5 bg-transparent border-none cursor-pointer transition-colors duration-200"
                style={{
                  padding: "12px 22px",
                  borderRadius: 999,
                  color: isActive
                    ? "#F5F5F5"
                    : "rgba(245, 245, 245, 0.55)",
                  background: "transparent",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: "-0.005em",
                  lineHeight: 1.2,
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.color = "rgba(245, 245, 245, 0.9)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.color = "rgba(245, 245, 245, 0.55)";
                }}
              >
                <Icon
                  size={18}
                  strokeWidth={1.75}
                  style={{ flexShrink: 0, opacity: isActive ? 0.95 : 0.7 }}
                />
                <span>{link.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    style={{
                      position: "absolute",
                      left: 18,
                      right: 18,
                      bottom: 6,
                      height: 2,
                      borderRadius: 2,
                      background: "#4A9EFF",
                      boxShadow: "0 0 12px rgba(74, 158, 255, 0.7)",
                    }}
                    transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile — top bar with hamburger */}
      <nav
        className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-5"
        style={{
          background: "rgba(10, 10, 10, 0.8)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 14,
            fontWeight: 500,
            color: "#F5F5F5",
            letterSpacing: "-0.005em",
          }}
        >
          Arun Sanjay
        </span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="flex flex-col gap-[5px] p-2 bg-transparent border-none cursor-pointer"
        >
          <motion.span
            className="block w-5 h-[1.5px] bg-[#F5F5F5]"
            animate={mobileOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-5 h-[1.5px] bg-[#F5F5F5]"
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className="block w-5 h-[1.5px] bg-[#F5F5F5]"
            animate={mobileOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-6 md:hidden"
          >
            {NAV_LINKS.map((link, i) => {
              const isActive = currentChapter.id === link.chapterId;
              const Icon = link.icon;
              return (
                <motion.button
                  key={link.chapterId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  onClick={() => handleNavClick(link.chapterId)}
                  className="inline-flex items-center gap-3 bg-transparent border-none cursor-pointer"
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 18,
                    fontWeight: 500,
                    color: isActive ? "#F5F5F5" : "rgba(245, 245, 245, 0.55)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  <Icon size={18} strokeWidth={1.75} />
                  {link.label}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
