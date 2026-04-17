"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useChapter } from "@/hooks/useChapter";

export default function ChapterIndicator() {
  const chapter = useChapter();

  return (
    <div
      className="fixed bottom-6 left-6 z-50"
      style={{ pointerEvents: "auto" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={chapter.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-[#0A0A0A]/90 backdrop-blur-md border border-[rgba(0,240,255,0.1)] rounded-[2px] px-4 py-3 flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-[2px] bg-[rgba(0,240,255,0.05)] flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-[#00F0FF]/40"
            >
              <rect x="2" y="2" width="5" height="5" rx="0" fill="currentColor" />
              <rect x="9" y="2" width="5" height="5" rx="0" fill="currentColor" />
              <rect x="2" y="9" width="5" height="5" rx="0" fill="currentColor" />
              <rect x="9" y="9" width="5" height="5" rx="0" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#00F0FF] font-bold">
              CH.0{chapter.number}
            </div>
            <div className="font-mono text-[11px] text-white/70 font-medium tracking-[0.1em]">
              {chapter.label}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
