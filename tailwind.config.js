/**
 * tailwind.config.js
 * ---------------------------------------------------------------------------
 * Design tokens for Pak Essentials, built from the OFFICIAL brand guide
 * (web-safe adjusted palette):
 *   Sage green   #96A887   — primary accent / nature cue (the logo's leaf)
 *   Blush pink   #E8C4C8   — soft secondary accent
 *   Warm beige   #EADCC6   — section backgrounds, warmth
 *   Gold         #B99657   — the logo's metallic ring, used for CTAs/prices
 *   Charcoal     #1F1F1F   — accessible body text
 *   Off-white    #F7F5F0   — base background
 *
 * LIGHT / DARK MODE
 * Rather than hard-coding colors, every "surface" and "text" color is a
 * CSS custom property (defined in app/globals.css for :root and .dark)
 * fed through Tailwind's `rgb(var(--x) / <alpha-value>)` pattern. This
 * means a class like `bg-surface` or `text-ink` automatically resolves to
 * the right color for whichever theme is active — components never need
 * a separate `dark:` variant for basic background/text/border colors.
 * The five brand accent colors (gold/sage/blush/beige) stay constant
 * across both themes since they're calibrated to work on both.
 *
 * `darkMode: 'class'` means dark mode is toggled by adding/removing a
 * `dark` class on <html> (see context/ThemeContext.js), not by the OS
 * setting alone — giving users an explicit switch, as requested.
 */
const colors = {
  // Theme-aware semantic tokens (see app/globals.css for the CSS vars)
  bg: 'rgb(var(--c-bg) / <alpha-value>)', // page background
  surface: 'rgb(var(--c-surface) / <alpha-value>)', // header/footer/cards
  surfacealt: 'rgb(var(--c-surface-alt) / <alpha-value>)', // beige-tinted panels
  ink: 'rgb(var(--c-ink) / <alpha-value>)', // primary text/icons
  muted: 'rgb(var(--c-muted) / <alpha-value>)', // secondary text
  line: 'rgb(var(--c-line) / <alpha-value>)', // borders/dividers (use with /opacity)

  // Fixed brand accents — same hex in both themes
  gold: {
    DEFAULT: '#B99657',
    light: '#D9BC7A',
    soft: '#EADCC6',
    dark: '#8C6C2A',
  },
  sage: {
    DEFAULT: '#96A887',
    light: '#B7C4AC',
    dark: '#6F8264',
  },
  blush: {
    DEFAULT: '#E8C4C8',
    dark: '#D39FA5',
  },
  beige: {
    DEFAULT: '#EADCC6',
  },
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors,
      fontFamily: {
        // Display serif for headlines — characterful, high-contrast,
        // reinforces the "classic/premium" brief.
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        // Clean grotesk for body copy, labels, and UI chrome.
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.28em',
      },
      boxShadow: {
        card: '0 2px 24px -8px rgba(31,31,31,0.14)',
        gold: '0 0 0 1px rgba(185,150,87,0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      maxWidth: {
        content: '1360px',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ringSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.6s ease forwards',
        ringSpin: 'ringSpin 12s linear infinite',
      },
    },
  },
  plugins: [],
};

