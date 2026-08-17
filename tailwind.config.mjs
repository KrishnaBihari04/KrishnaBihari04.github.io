/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Base
        black:       '#0a0a0a',
        charcoal:    '#111111',
        'charcoal-2': '#161616',
        'charcoal-3': '#1e1e1e',
        'charcoal-4': '#242424',

        // Text
        'soft-white':  '#f0ede8',
        'muted':       '#6b6b6b',
        'muted-light': '#9a9a9a',

        // Accent — Sand
        sand:        '#c8b89a',
        'sand-light': '#d9ccb8',
        'sand-dark':  '#a89070',

        // Accent — Forest Green
        forest:      '#2d4a3e',
        'forest-mid': '#3a5f51',
        'forest-light': '#4a7a68',
        'forest-bright': '#5c9e83',

        // Borders
        'border-subtle': '#222222',
        'border-mid':    '#2e2e2e',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      fontSize: {
        'display-xl': ['clamp(3.5rem, 8vw, 7rem)', { lineHeight: '1.0', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.5rem, 5vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(1.8rem, 3.5vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'body-lg':    ['1.125rem', { lineHeight: '1.7' }],
        'body-md':    ['1rem',     { lineHeight: '1.7' }],
        'body-sm':    ['0.875rem', { lineHeight: '1.6' }],
        'label':      ['0.75rem',  { lineHeight: '1.4', letterSpacing: '0.12em' }],
      },

      spacing: {
        'section': '8rem',
        'section-sm': '5rem',
      },

      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
      },

      transitionTimingFunction: {
        'cinematic': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'entrance':  'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },

      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms',
        '1200': '1200ms',
      },

      animation: {
        'fade-up':    'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in':    'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'mask-reveal':'maskReveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },

      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        maskReveal: {
          '0%':   { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0% 0 0)' },
        },
      },

      backgroundImage: {
        'radial-dark': 'radial-gradient(ellipse 80% 60% at 50% 0%, #1e1e1e 0%, #0a0a0a 70%)',
        'radial-sand': 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(200,184,154,0.06) 0%, transparent 70%)',
        'vignette':    'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%)',
      },
    },
  },
  plugins: [],
}