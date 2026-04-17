"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let scrollProgressValue = 0;
let listeners: Array<(progress: number) => void> = [];

export function getScrollProgress(): number {
  return scrollProgressValue;
}

export function subscribeScrollProgress(cb: (progress: number) => void) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

export function scrollToProgress(progress: number) {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: progress * scrollHeight, behavior: "smooth" });
}

export function initSmoothScroll(): () => void {
  if (typeof window === "undefined") return () => {};

  // Simple ScrollTrigger that tracks overall page progress — no Lenis
  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      scrollProgressValue = self.progress;
      for (const cb of listeners) {
        cb(scrollProgressValue);
      }
    },
  });

  return () => {
    ScrollTrigger.getAll().forEach((st) => st.kill());
    listeners = [];
  };
}
