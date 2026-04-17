import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-bg-base)",
        foreground: "var(--color-text-default)",
        bg: {
          base: "var(--color-bg-base)",
          surface: "var(--color-bg-surface)",
          "surface-2": "var(--color-bg-surface-2)",
          "surface-3": "var(--color-bg-surface-3)",
        },
        border: {
          subtle: "var(--color-border-subtle)",
          default: "var(--color-border-default)",
          hover: "var(--color-border-hover)",
        },
        text: {
          primary: "var(--color-text-primary)",
          default: "var(--color-text-default)",
          muted: "var(--color-text-muted)",
          subtle: "var(--color-text-subtle)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          dim: "var(--color-accent-dim)",
        },
        highlight: "var(--color-highlight)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
