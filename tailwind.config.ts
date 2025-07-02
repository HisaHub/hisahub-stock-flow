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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Keep existing custom colors for app-specific styling
        charcoal: "#2A2A2A",
        neutral: {
          DEFAULT: "#8E9196",
          light: "#4A5568",
        },
        "off-white": "#F8F9FA",
        "nav-bg": "#181f2c",
        "glass-bg": "rgba(255,255,255,0.08)",
        "light-text": "#1A1A1A",
        "light-text-secondary": "#4A5568",
        "light-border": "#E2E8F0",
        "light-bg-highlight": "#F7FAFC",
        "light-success": "#28A745",
        "light-danger": "#E53E3E",
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
