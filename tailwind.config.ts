import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        serif: ["var(--font-serif)", "Cambria", "Georgia", "serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter2: "-0.025em",
      },
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
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "aurora-rotate": {
          "0%,100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(180deg)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(-14px)" },
        },
        "halo-pulse": {
          "0%,100%": { opacity: "0.5", transform: "scale(1)" },
          "50%":     { opacity: "0.85", transform: "scale(1.08)" },
        },
        sheen: {
          "0%":   { transform: "translateX(-150%) skewX(-12deg)" },
          "100%": { transform: "translateX(250%)  skewX(-12deg)" },
        },
        "gradient-pan": {
          "0%":   { backgroundPosition: "0% 50%" },
          "50%":  { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        glitch: {
          "0%, 100%": { transform: "translate(0, 0)", filter: "none" },
          "10%":      { transform: "translate(-3px, 1px)" },
          "20%":      { transform: "translate(3px, -1px)", filter: "hue-rotate(25deg)" },
          "30%":      { transform: "translate(-1px, -2px)" },
          "40%":      { transform: "translate(2px, 1px)", filter: "hue-rotate(-15deg)" },
          "50%":      { transform: "translate(-1px, 2px)" },
          "60%":      { transform: "translate(1px, -1px)" },
          "70%":      { transform: "translate(-2px, -1px)", filter: "hue-rotate(10deg)" },
          "80%":      { transform: "translate(1px, 2px)" },
          "90%":      { transform: "translate(0, -1px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "pulse-soft": "pulse-soft 2.5s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        "aurora-rotate": "aurora-rotate 24s ease-in-out infinite",
        float: "float 4.5s ease-in-out infinite",
        "halo-pulse": "halo-pulse 3.5s ease-in-out infinite",
        sheen: "sheen 2.4s ease-in-out infinite",
        "gradient-pan": "gradient-pan 8s ease-in-out infinite",
        glitch: "glitch 280ms ease-in-out",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at center, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
