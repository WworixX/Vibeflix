import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        char: {
          950: "#07100D",
          900: "#0B1411",
          850: "#0E1815",
          800: "#121E1A",
          700: "#1A2924",
          600: "#243630",
          500: "#34504A",
          400: "#4B6E66",
        },
        mint: {
          50: "#E6FBF2",
          100: "#C6F5DF",
          200: "#9EEAC4",
          300: "#6FDCA6",
          400: "#3FCB89",
          500: "#22B97A",
          600: "#179565",
          700: "#0F6E4D",
          800: "#0B5039",
          900: "#08382A",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-geist)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "mint-gradient":
          "linear-gradient(135deg, #6FDCA6 0%, #22B97A 55%, #0F6E4D 100%)",
        "mint-soft":
          "linear-gradient(135deg, rgba(63,203,137,0.30) 0%, rgba(17,149,101,0.10) 60%, transparent 100%)",
        mesh: `radial-gradient(at 18% 12%, rgba(63,203,137,0.18) 0px, transparent 55%),
               radial-gradient(at 82% 8%, rgba(17,149,101,0.20) 0px, transparent 50%),
               radial-gradient(at 50% 95%, rgba(34,185,122,0.12) 0px, transparent 55%)`,
      },
      borderRadius: {
        xl2: "1.25rem",
        "4xl": "2rem",
      },
      transitionTimingFunction: {
        exhale: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        drift: {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(2%, -2%, 0) scale(1.04)" },
        },
        breathe: {
          "0%,100%": { opacity: "0.35" },
          "50%": { opacity: "0.55" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        wave: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.4s linear infinite",
        drift: "drift 18s ease-in-out infinite",
        breathe: "breathe 7s ease-in-out infinite",
        marquee: "marquee 55s linear infinite",
        "wave-slow": "wave 14s ease-in-out infinite",
        "wave-mid": "wave 10s ease-in-out infinite",
        "wave-fast": "wave 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
