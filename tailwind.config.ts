import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        script: ["'Great Vibes'", "cursive"],
        display: ["'Cormorant Garamond'", "serif"],
        body: ["'Lato'", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        // Estes usam o placeholder <alpha-value> (em vez de baixar a opacidade
        // dentro da própria variável, como --border/--input abaixo) para que
        // modificadores de opacidade do Tailwind funcionem, ex.: bg-marrom-wave/30.
        creme: "hsl(var(--creme) / <alpha-value>)",
        marrom: { DEFAULT: "hsl(var(--marrom) / <alpha-value>)", wave: "hsl(var(--marrom-wave) / <alpha-value>)" },
        texto: "hsl(var(--texto) / <alpha-value>)",
        suave: "hsl(var(--suave) / <alpha-value>)",
        whatsapp: "hsl(var(--whatsapp) / <alpha-value>)",
        dourado: "hsl(var(--dourado) / <alpha-value>)",
        destaque: "hsl(var(--destaque) / <alpha-value>)",
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
        "mimo-fade-in": { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "mimo-slide-right": { from: { opacity: "0", transform: "translateX(16px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        "mimo-scale-in": { from: { opacity: "0", transform: "scale(0.8)" }, to: { opacity: "1", transform: "scale(1)" } },
        "mimo-slide-up": { from: { opacity: "0", transform: "translate(-50%, 20px)" }, to: { opacity: "1", transform: "translate(-50%, 0)" } },
      },
      animation: {
        "mimo-fade-in": "mimo-fade-in 0.5s ease-out forwards",
        "mimo-slide-right": "mimo-slide-right 0.5s ease-out forwards",
        "mimo-scale-in": "mimo-scale-in 0.4s ease-out forwards",
        "mimo-slide-up": "mimo-slide-up 0.3s ease-out forwards",
      },
    },
  },
} satisfies Config;
