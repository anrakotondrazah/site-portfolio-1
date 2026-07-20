import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#000000",
          dark: "#03030a",
          "dark-2": "#07070f",
          "dark-3": "#0d0d1a",
          cyan: "#00e5ff",
          "cyan-dim": "#00b8cc",
          "cyan-deep": "#007a87",
          violet: "#9b00ff",
          "violet-dim": "#7700cc",
          "violet-deep": "#4a0080",
          "text-primary": "#d4d4e8",
          "text-secondary": "#6b6b8a",
          "text-dim": "#3d3d5c",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "Consolas", ...fontFamily.mono],
        display: ["Orbitron", ...fontFamily.sans],
        sans: ["Inter", ...fontFamily.sans],
      },
      fontSize: {
        "display-xl": [
          "clamp(3rem, 8vw, 7rem)",
          { lineHeight: "0.95", letterSpacing: "-0.02em" },
        ],
        "display-lg": [
          "clamp(2rem, 5vw, 4.5rem)",
          { lineHeight: "1", letterSpacing: "-0.01em" },
        ],
        "display-md": ["clamp(1.5rem, 3vw, 2.5rem)", { lineHeight: "1.1" }],
        "mono-sm": ["0.75rem", { lineHeight: "1.6", letterSpacing: "0.08em" }],
        "mono-xs": ["0.65rem", { lineHeight: "1.6", letterSpacing: "0.12em" }],
      },
      spacing: {
        section: "6rem",
        "section-lg": "9rem",
      },
      maxWidth: {
        site: "1440px",
        content: "1100px",
        narrow: "720px",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "floatSlow 10s ease-in-out infinite",
        glitch: "glitch 4s step-end infinite",
        "scan-line": "scanLine 2.5s linear infinite",
        "pulse-cyan": "pulseCyan 2s ease-in-out infinite",
        "blink-cursor": "blinkCursor 1s step-end infinite",
        noise: "noise 0.2s steps(1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-8px) rotate(0.5deg)" },
          "66%": { transform: "translateY(-4px) rotate(-0.3deg)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        glitch: {
          "0%, 92%, 100%": {
            clipPath: "inset(0 0 0 0)",
            transform: "translate(0)",
          },
          "93%": {
            clipPath: "inset(20% 0 40% 0)",
            transform: "translate(-3px, 2px)",
          },
          "94%": {
            clipPath: "inset(50% 0 30% 0)",
            transform: "translate(3px, -1px)",
          },
          "95%": {
            clipPath: "inset(10% 0 70% 0)",
            transform: "translate(-2px, 3px)",
          },
          "96%": { clipPath: "inset(0 0 0 0)", transform: "translate(0)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)", opacity: "0.8" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateY(200%)", opacity: "0.8" },
        },
        pulseCyan: {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(0, 229, 255, 0)",
            borderColor: "rgba(0, 229, 255, 0.2)",
          },
          "50%": {
            boxShadow: "0 0 20px 0 rgba(0, 229, 255, 0.15)",
            borderColor: "rgba(0, 229, 255, 0.5)",
          },
        },
        blinkCursor: {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
        noise: {
          "0%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-2%, -3%)" },
          "20%": { transform: "translate(3%, 1%)" },
          "30%": { transform: "translate(-1%, 4%)" },
          "40%": { transform: "translate(2%, -2%)" },
          "50%": { transform: "translate(-3%, 2%)" },
          "60%": { transform: "translate(1%, -4%)" },
          "70%": { transform: "translate(4%, 3%)" },
          "80%": { transform: "translate(-2%, 1%)" },
          "90%": { transform: "translate(3%, -3%)" },
          "100%": { transform: "translate(0, 0)" },
        },
      },
      boxShadow: {
        "cyan-sm": "0 0 10px rgba(0, 229, 255, 0.15)",
        "cyan-md":
          "0 0 20px rgba(0, 229, 255, 0.25), 0 0 60px rgba(0, 229, 255, 0.08)",
        "cyan-lg":
          "0 0 40px rgba(0, 229, 255, 0.3), 0 0 100px rgba(0, 229, 255, 0.12)",
        "violet-sm": "0 0 10px rgba(155, 0, 255, 0.15)",
        "violet-md":
          "0 0 20px rgba(155, 0, 255, 0.25), 0 0 60px rgba(155, 0, 255, 0.08)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
        "card-hover":
          "0 8px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 229, 255, 0.1)",
      },
      backgroundImage: {
        "cyber-grid":
          "linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)",
        "hero-radial":
          "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,229,255,0.05) 0%, rgba(155,0,255,0.03) 40%, transparent 70%)",
        "section-radial":
          "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(155,0,255,0.04) 0%, transparent 70%)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
};
