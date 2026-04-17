"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useChapter } from "@/hooks/useChapter";

const CHAPTER_MAP: Record<string, { number: string; label: string }> = {
  origin: { number: "01", label: "ORIGIN" },
  stack: { number: "02", label: "STACK" },
  work: { number: "03", label: "WORK" },
  arena: { number: "04", label: "ARENA" },
  signal: { number: "05", label: "SIGNAL" },
};

export default function ChapterIndicator() {
  const currentChapter = useChapter();
  const chapter = currentChapter ? CHAPTER_MAP[currentChapter.id] : null;

  return (
    <AnimatePresence mode="wait">
      {chapter && (
        <motion.div
          key={chapter.number}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-2.5 rounded-lg backdrop-blur-md"
          style={{
            background: "rgba(17, 17, 17, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <span
            className="font-mono text-[11px] font-medium"
            style={{ color: "#4A9EFF" }}
          >
            {chapter.number}
          </span>
          <span
            className="w-px h-3"
            style={{ background: "rgba(255, 255, 255, 0.06)" }}
          />
          <span
            className="font-mono text-[10px] tracking-[0.15em] uppercase"
            style={{ color: "#7A7A7A" }}
          >
            {chapter.label}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
