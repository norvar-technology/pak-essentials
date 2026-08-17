'use client';

/**
 * context/ThemeContext.js
 * ---------------------------------------------------------------------------
 * Light/dark theme switching. Deliberately simple and dependency-free
 * (no next-themes package) so it's easy to read and modify:
 *
 *   1. On first load, we check localStorage for a saved choice; if there
 *      isn't one, we fall back to the visitor's OS preference
 *      (prefers-color-scheme).
 *   2. Whenever the theme changes, we add/remove the `dark` class on
 *      <html> — every color in tailwind.config.js is wired to flip
 *      automatically based on that class (see app/globals.css).
 *   3. The choice is saved to localStorage so it persists across visits.
 *
 * AVOIDING FLASH-OF-WRONG-THEME
 * This provider runs after React hydrates, which would normally cause a
 * flash of the light theme before switching to dark. To prevent that, a
 * small blocking <script> in app/layout.js sets the class synchronously
 * before the page paints — this provider then just keeps React's state in
 * sync with whatever that script already applied.
 */

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'pak-essentials-theme';

export function ThemeProvider({ children }) {
  // Read the class the blocking script already applied, so React's state
  // matches the DOM from the very first render (no mismatch/flicker).
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const initial = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    setTheme(initial);
  }, []);

  function applyTheme(next) {
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch (err) {
      console.warn('Could not save theme preference:', err);
    }
  }

  function toggleTheme() {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme() must be used inside a <ThemeProvider>');
  return ctx;
}

/**
 * The blocking script injected into <head> in app/layout.js, as a string.
 * Runs before React hydrates so the correct theme class is present for the
 * very first paint. Kept here so the logic lives in one place even though
 * it gets rendered from layout.js.
 */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var saved = localStorage.getItem('${STORAGE_KEY}');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = saved || (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;
