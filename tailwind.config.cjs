/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: 'true',
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      screens:{
        'xs': '400px',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', ...defaultTheme.fontFamily.sans],
        inter: ['var(--font-inter)', 'sans-serif'],
        kufi: ['var(--font-arabic)', 'sans-serif'],
        // sans: ['Inter var', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
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
        // Spinet Brand Colors
        spinet: {
          primary: 'hsl(var(--spinet-primary))', // #145FF2
          navy: 'hsl(var(--spinet-navy))', // #082356
          dark: 'hsl(var(--spinet-dark))', // #010C32
          deep: 'hsl(var(--spinet-deep))', // #1A3B8E / #EEF6FF in dark
          hover: 'hsl(var(--spinet-hover))', // #0A2C6C / lighter in dark
          button: 'hsl(var(--spinet-button))', // #001838 / #145FF2 in dark
          light: 'hsl(var(--spinet-light))', // #EEF6FF
          accent: 'hsl(var(--spinet-accent))', // #8FC8FF
          soft: 'hsl(var(--spinet-soft))', // #DEE3F8
          muted: 'hsl(var(--spinet-muted))', // #F1F5F9 / #082356 in dark
          'text-primary': 'hsl(var(--spinet-text-primary))', // #1A3B8E / #EEF6FF in dark
          'text-muted': 'hsl(var(--spinet-text-muted))', // #1A3B8E/80% / #EEF6FF/80% in dark
        },
        // Legacy colors for backward compatibility
        azure: '#145FF2',
        navy: '#082356',
        main: '#010C32',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
        floating: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(10px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        floating: 'floating 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};