/** @type {import('tailwindcss').Config} */
module.exports = {
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
        },
        vivid: {
          tangerine: "#FB7185",
          amber: "#FBBF24",
          gold: "#F59E0B",
          emerald: "#10B981",
          teal: "#14B8A6",
          sky: "#0EA5E9",
          indigo: "#6366F1",
          violet: "#8B5CF6",
          magenta: "#D946EF",
          royal: "#1D4ED8"
        }
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" }
        },
        "float-fast": {
          "0%, 100%": { transform: "translateY(0px) rotate(-1deg)" },
          "50%": { transform: "translateY(-8px) rotate(1deg)" }
        },
        drift: {
          "0%": { transform: "translateX(-8%)" },
          "50%": { transform: "translateX(8%)" },
          "100%": { transform: "translateX(-8%)" }
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(28px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" }
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        }
      },
      animation: {
        "float-slow": "float-slow 7s ease-in-out infinite",
        "float-fast": "float-fast 5s ease-in-out infinite",
        drift: "drift 12s ease-in-out infinite",
        "spin-slow": "spin-slow 18s linear infinite",
        shimmer: "shimmer 2.8s linear infinite",
        "rise-in": "rise-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pop-in": "pop-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
        "gradient-pan": "gradient-pan 10s ease infinite"
      }
    }
  },
  plugins: []
};
