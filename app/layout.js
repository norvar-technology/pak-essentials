import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider, THEME_INIT_SCRIPT } from '@/context/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import { buildMetadata, SITE_NAME, SITE_URL } from '@/lib/seo';

/**
 * app/layout.js
 * ---------------------------------------------------------------------------
 * The root layout wraps EVERY page in the app. This is where we:
 *   1. Load the two brand fonts (see tailwind.config.js for how they're
 *      wired into `font-display` / `font-sans` utility classes).
 *   2. Inject a tiny BLOCKING script in <head> that applies the saved
 *      light/dark theme class to <html> before the page paints — this is
 *      what prevents a flash of the wrong theme on load. See
 *      context/ThemeContext.js for the script contents and why it needs
 *      to run this early (before React hydrates).
 *   3. Set default, site-wide <metadata> (used as a fallback whenever a
 *      specific page doesn't override title/description/OG tags).
 *   4. Mount <ThemeProvider> and <CartProvider> once so both are available
 *      everywhere.
 *   5. Render the persistent <Header>, <Footer> and floating
 *      <WhatsAppWidget> around the page-specific `children`.
 */

// Display serif — characterful headings, used with restraint (see brief).
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

// Clean grotesk — body copy & UI chrome.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  ...buildMetadata({
    title: `${SITE_NAME} | Premium Skincare & Wellness, Delivered`,
    description:
      'Pak Essentials is a curated storefront for authentic, third-party skincare, body-care and wellness brands — face creams to body oils, toners to supplements — delivered across Nigeria.',
    path: '/',
  }),
  metadataBase: new URL(SITE_URL),
  icons: {
    // Replace with a real favicon uploaded to R2 (or /public) once ready.
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Must run before hydration to avoid a flash of the wrong theme.
            suppressHydrationWarning above stops React from complaining that
            this script changes <html>'s class before it takes over. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased bg-bg text-ink">
        <ThemeProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <WhatsAppWidget />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
