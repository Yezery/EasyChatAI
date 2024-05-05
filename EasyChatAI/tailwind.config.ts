import type { Config } from 'tailwindcss'
/** @type {import('tailwindcss').Config} */
import Form from "@tailwindcss/forms";
import Typography from "@tailwindcss/typography";
import daisyui from "daisyui"
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["light", "dark"],
  },
  plugins: [daisyui,Form,Typography],
}satisfies Config
