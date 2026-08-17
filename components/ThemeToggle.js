'use client';

/**
 * components/ThemeToggle.js
 * ---------------------------------------------------------------------------
 * A small sun/moon icon button that flips the site between light and dark
 * mode via useTheme() (see context/ThemeContext.js). Dropped into the
 * header, next to search and cart.
 */

import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 text-ink/70 hover:text-gold-dark transition-colors"
    >
      {isDark ? (
        // Sun icon — shown when currently dark, inviting a switch to light
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <circle cx="12" cy="12" r="4.5" />
          <path
            d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        // Moon icon — shown when currently light, inviting a switch to dark
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
