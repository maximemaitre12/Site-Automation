import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1400px',
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        agent: {
          flow: "hsl(var(--agent-flow))",
          brain: "hsl(var(--agent-brain))",
          support: "hsl(var(--agent-support))",
          hr: "hsl(var(--agent-hr))",
          compliance: "hsl(var(--agent-compliance))",
          sales: "hsl(var(--agent-sales))",
          data: "hsl(var(--agent-data))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "cloud-float": {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "25%": { transform: "translateY(-8px) translateX(4px)" },
          "50%": { transform: "translateY(-4px) translateX(-4px)" },
          "75%": { transform: "translateY(-12px) translateX(2px)" },
        },
        "cloud-drift": {
          "0%, 100%": { transform: "translateX(0) scale(1)" },
          "50%": { transform: "translateX(10px) scale(1.02)" },
        },
        "cloud-morph": {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "25%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
          "50%": { borderRadius: "50% 60% 30% 60% / 30% 60% 70% 40%" },
          "75%": { borderRadius: "60% 40% 60% 30% / 70% 30% 50% 60%" },
        },
        "cloud-pulse": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        "cloud-fade-in": {
          from: { opacity: "0", transform: "translateY(20px) scale(0.9)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        // Tour animation keyframes
        "cursor-trail": {
          "0%": { opacity: "0.4", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(2)" },
        },
        "cursor-ripple": {
          "0%": { opacity: "0.8", transform: "translate(-50%, -50%) scale(0.5)" },
          "100%": { opacity: "0", transform: "translate(-50%, -50%) scale(2)" },
        },
        "cursor-ripple-inner": {
          "0%": { opacity: "0.6", transform: "scale(0.8)" },
          "100%": { opacity: "0", transform: "scale(1.5)" },
        },
        "ripple-expand": {
          "0%": { opacity: "1", transform: "scale(0)" },
          "100%": { opacity: "0", transform: "scale(2)" },
        },
        "ripple-fade": {
          "0%": { opacity: "0.5", transform: "scale(0)" },
          "100%": { opacity: "0", transform: "scale(1.5)" },
        },
        "ripple-dot": {
          "0%": { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
          "100%": { opacity: "0", transform: "translate(-50%, -50%) scale(0)" },
        },
        "tooltip-appear": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "spotlight-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.95" },
        },
        "spotlight-border": {
          "0%, 100%": { opacity: "0.8", strokeWidth: "2" },
          "50%": { opacity: "1", strokeWidth: "3" },
        },
        "scene-enter": {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scene-exit": {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(-40px)" },
        },
        "element-highlight": {
          "0%": { boxShadow: "0 0 0 0 hsl(var(--primary) / 0.4)" },
          "50%": { boxShadow: "0 0 0 8px hsl(var(--primary) / 0.2)" },
          "100%": { boxShadow: "0 0 0 0 hsl(var(--primary) / 0)" },
        },
        "count-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "progress-fill": {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width)" },
        },
        "stagger-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--primary) / 0.3)" },
          "50%": { boxShadow: "0 0 40px hsl(var(--primary) / 0.6)" },
        },
        "line-draw": {
          "0%": { strokeDashoffset: "100%" },
          "100%": { strokeDashoffset: "0%" },
        },
        "confetti": {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(400px) rotate(720deg)", opacity: "0" },
        },
        "drag-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "waveform": {
          "0%, 100%": { height: "20%" },
          "50%": { height: "100%" },
        },
        "typing-cursor": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "slide-up-fade": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "zoom-in": {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-in-left": "slide-in-left 0.4s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "cloud-float": "cloud-float 8s ease-in-out infinite",
        "cloud-drift": "cloud-drift 6s ease-in-out infinite",
        "cloud-morph": "cloud-morph 12s ease-in-out infinite",
        "cloud-pulse": "cloud-pulse 4s ease-in-out infinite",
        "cloud-fade-in": "cloud-fade-in 0.6s ease-out forwards",
        // Tour animations
        "cursor-trail": "cursor-trail 0.3s ease-out forwards",
        "cursor-ripple": "cursor-ripple 0.4s ease-out forwards",
        "ripple-expand": "ripple-expand 0.6s ease-out forwards",
        "tooltip-appear": "tooltip-appear 0.3s ease-out forwards",
        "scene-enter": "scene-enter 0.5s ease-out forwards",
        "scene-exit": "scene-exit 0.4s ease-out forwards",
        "element-highlight": "element-highlight 1s ease-in-out",
        "count-up": "count-up 0.4s ease-out forwards",
        "stagger-in": "stagger-in 0.5s ease-out forwards",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "line-draw": "line-draw 1s ease-out forwards",
        "confetti": "confetti 3s ease-out forwards",
        "drag-float": "drag-float 0.3s ease-in-out infinite",
        "waveform": "waveform 0.5s ease-in-out infinite",
        "typing-cursor": "typing-cursor 1s step-end infinite",
        "slide-up-fade": "slide-up-fade 0.6s ease-out forwards",
        "zoom-in": "zoom-in 0.4s ease-out forwards",
        "float": "float 3s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-pattern": "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233C4DFE' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
