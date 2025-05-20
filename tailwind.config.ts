
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      }
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#131b26", // Deeper navy to match your mockup
          foreground: "#F8F9FA",
        },
        secondary: {
          DEFAULT: "#FFBF00",
          foreground: "#131b26",
        },
        background: "#131b26",
        charcoal: "#2A2A2A",
        neutral: "#8E9196",
        "off-white": "#F8F9FA",
        card: "#1b2230",
        accent: "#FFBF00",
        "nav-bg": "#181f2c",
        "glass-bg": "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      keyframes: {
        'logo-float': {
          '0%,100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-10px) scale(1.08)' }
        },
      },
      animation: {
        'logo-float': 'logo-float 2s ease-in-out infinite',
        "fade-in": "fade-in 0.4s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
