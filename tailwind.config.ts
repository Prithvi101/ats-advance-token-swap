import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#0FEFB0",
        primaryDark: "#020D0A",
        primaryLight: "#fff",
        deselect: "#1b1b1b",
        select: "#000",
        "neon-green": "#32ff7e",
        "neon-blue": "#18dcff",
        "neon-purple": "#7d5fff",
        "neon-orange": "#ff9f43",
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in",
        modalOpen: "modalOpen 0.3s ease-out",
        "slide-up": "slideUp 0.5s ease-out", // Custom slide-up animation
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        modalOpen: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
