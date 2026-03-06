import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        moonext: {
          navy: "#0F2747",
          orange: "#F97316",
          slate: "#1E293B",
          mist: "#F1F5F9"
        }
      }
    }
  },
  plugins: []
};

export default config;
