/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'oklch(var(--border) / <alpha-value>)',
        input: 'oklch(var(--input) / <alpha-value>)',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        // Job Portal brand colors
        portal: {
          50: 'oklch(0.97 0.01 240)',
          100: 'oklch(0.93 0.02 240)',
          200: 'oklch(0.86 0.04 240)',
          300: 'oklch(0.74 0.07 240)',
          400: 'oklch(0.58 0.09 240)',
          500: 'oklch(0.45 0.1 240)',
          600: 'oklch(0.38 0.09 240)',
          700: 'oklch(0.3 0.08 240)',
          800: 'oklch(0.22 0.06 240)',
          900: 'oklch(0.15 0.04 240)',
        },
        teal: {
          50: 'oklch(0.97 0.02 185)',
          100: 'oklch(0.93 0.05 185)',
          200: 'oklch(0.86 0.08 185)',
          300: 'oklch(0.74 0.11 185)',
          400: 'oklch(0.62 0.13 185)',
          500: 'oklch(0.55 0.14 185)',
          600: 'oklch(0.47 0.13 185)',
          700: 'oklch(0.38 0.11 185)',
          800: 'oklch(0.28 0.08 185)',
          900: 'oklch(0.18 0.05 185)',
        },
        amber: {
          50: 'oklch(0.98 0.03 75)',
          100: 'oklch(0.95 0.07 75)',
          200: 'oklch(0.9 0.12 75)',
          300: 'oklch(0.83 0.16 75)',
          400: 'oklch(0.75 0.18 75)',
          500: 'oklch(0.68 0.18 75)',
          600: 'oklch(0.6 0.17 75)',
          700: 'oklch(0.5 0.15 75)',
          800: 'oklch(0.38 0.11 75)',
          900: 'oklch(0.25 0.07 75)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.12), 0 2px 4px -1px rgb(0 0 0 / 0.08)',
        'portal': '0 0 0 3px oklch(0.38 0.09 240 / 0.15)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};
