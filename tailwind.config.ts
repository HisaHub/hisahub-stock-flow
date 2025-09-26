
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
          DEFAULT: "#131b26", // Deep navy for dark theme
          foreground: "#F8F9FA",
          light: "#005C9D", // Navy blue for light theme
        },
        secondary: {
          DEFAULT: "#FFC000", // Amber for dark theme
          foreground: "#131b26",
          light: "#FFD700", // Gold for light theme
        },
        background: {
          DEFAULT: "#131b26",
          light: "#F9FAFB", // Soft gray white for light theme
        },
        charcoal: "#2A2A2A",
        neutral: {
          DEFAULT: "#8E9196",
          light: "#4A5568", // Muted dark grey for light theme secondary text
        },
        "off-white": "#F8F9FA",
        card: {
          DEFAULT: "#1b2230",
          light: "#FFFFFF", // White cards for light theme
        },
        accent: {
          DEFAULT: "#FFC000",
          light: "#FFFBEA", // Soft gold tint for light theme highlights
        },
        "nav-bg": "#181f2c",
        "glass-bg": "rgba(255,255,255,0.08)",
        // Light theme specific colors
        "light-text": "#1A1A1A", // Main text for light theme
        "light-text-secondary": "#4A5568", // Secondary text for light theme
        "light-border": "#E2E8F0", // Borders for light theme
        "light-bg-highlight": "#F7FAFC", // Background highlights
        "light-success": "#28A745", // Success/profit color
        "light-danger": "#E53E3E", // Danger/loss color
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
      boxShadow: {
        'light': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'light-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config
