// tailwind.config.mjs
import { defineConfig } from "tailwindcss";

export default defineConfig({
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        rotateEyes: "rotateEyes 4s linear infinite",
        wonderFace: "wonderFace 2s cubic-bezier(0.075, 0.82, 0.165, 1) infinite",
      },
      keyframes: {
        rotateEyes: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        wonderFace: {
          "0%, 100%": { height: "50px" },
          "50%": { height: "80px" },
        },
      },
    },
  },
  plugins: [],
});
