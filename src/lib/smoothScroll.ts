'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let scrollProgressValue = 0;
const listeners: Array<(progress: number) => void> = [];

export function getScrollProgress(): number {
  return scrollProgressValue;
}

export function subscribeScrollProgress(cb: (progress: number) => void): () => void {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx > -1) listeners.splice(idx, 1);
  };
}

export function scrollToProgress(progress: number): void {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const target = maxScroll * Math.max(0, Math.min(1, progress));
  window.scrollTo({ top: target, behavior: 'smooth' });
}

export function initSmoothScroll(): () => void {
  const trigger = ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      scrollProgressValue = self.progress;
      for (let i = 0; i < listeners.length; i++) {
        listeners[i](scrollProgressValue);
      }
    },
  });

  return () => {
    trigger.kill();
  };
}
