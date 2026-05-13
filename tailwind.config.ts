import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07070A",
          900: "#0A0A0F",
          800: "#111118",
          700: "#1A1A24",
          600: "#262633",
          500: "#3A3A4A",
        },
        vibe: {
          50: "#FDE7F2",
          200: "#FAB1D4",
          400: "#F25CA2",
          500: "#E11D74",
          600: "#B91560",
          700: "#7C3AED",
          800: "#5B21B6",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["'Instrument Serif'", "Georgia", "serif"],
      },
      backgroundImage: {
        "vibe-gradient": "linear-gradient(135deg, #E11D74 0%, #7C3AED 100%)",
        "radial-fade":
          "radial-gradient(ellipse at top, rgba(124,58,237,0.25), transparent 60%)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.5s linear infinite",
        floaty: "floaty 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
