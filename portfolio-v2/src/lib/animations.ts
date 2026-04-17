import type { Variants, Transition } from 'framer-motion';

export const EASE_OUT: [number, number, number, number] = [0, 0, 0.2, 1];
export const EASE_IN: [number, number, number, number] = [0.4, 0, 1, 1];
export const EASE_INOUT: [number, number, number, number] = [0.4, 0, 0.2, 1];

export const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE_OUT } as Transition,
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5, ease: EASE_OUT } as Transition,
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};
