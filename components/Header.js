'use client';

/**
 * components/Header.js
 * ---------------------------------------------------------------------------
 * Sticky site header, redesigned to match the light, editorial reference
 * sites (Blume, Beauty Heroes): a bright surface background, a slim
 * announcement strip on top, a centered wordmark, and understated nav —
 * not the heavy dark bar from the first draft. Colors are all semantic
 * tokens (`bg-surface`, `text-ink`, `border-line/…`) so this same markup
 * automatically restyles for dark mode with zero extra classes — see
 * app/globals.css + tailwind.config.js for how those tokens flip.
 *
 * Contains:
 *   - Announcement strip
 *   - Logo (links home)
 *   - Desktop category nav (flat dropdown — only 6 categories now)
 *   - Search trigger -> opens <SearchOverlay />
 *   - Theme toggle (light/dark)
 *   - Cart trigger -> opens <CartDrawer /> with live item count
 *   - Mobile hamburger -> slide-out menu with the same links
 */

import { useState } from 'react';
import Link from 'next/link';
import { categories } from '@/data/categories';
import { useCart } from '@/context/CartContext';
import SearchOverlay from './SearchOverlay';
import CartDrawer from './CartDrawer';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur text-ink border-b border-line/10">
        {/* Slim top strip — trust line, sets a premium/editorial tone */}
        <div className="hidden sm:block text-center text-[11px] tracking-widest2 uppercase text-gold-dark/90 py-2 border-b border-line/10 bg-surfacealt/50">
          Authentic curated beauty &amp; skincare products, delivered across Nigeria
        </div>

        <div className="max-w-content mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 -ml-2"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <BarsIcon />
          </button>

          {/* Logo / wordmark */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="font-display text-xl sm:text-2xl tracking-wide">
              Pak <span className="text-gold-dark">Essentials</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8 font-sans text-sm tracking-wide">
            <div
              className="group relative py-8"
              onMouseEnter={() => setCategoryMenuOpen(true)}
              onMouseLeave={() => setCategoryMenuOpen(false)}
            >
              <button className="uppercase tracking-widest2 text-[13px] hover:text-gold-dark transition-colors">
                Shop by category
              </button>
              {/* Dropdown — a single flat list now that there are only 6 categories */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 w-72 transition-opacity duration-200 ${
                  categoryMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
                }`}
              >
                <div className="bg-surface border border-line/10 shadow-card rounded-b-xl2 p-6">
                  <ul className="space-y-2.5">
                    {categories.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/category/${c.slug}`} className="hover:text-gold-dark transition-colors">
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <Link href="/products" className="uppercase tracking-widest2 text-[13px] hover:text-gold-dark transition-colors">
              All products
            </Link>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <button
              aria-label="Search products"
              className="p-2 hover:text-gold-dark transition-colors"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon />
            </button>
            <button
              aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`}
              className="relative p-2 hover:text-gold-dark transition-colors"
              onClick={() => setCartOpen(true)}
            >
              <BagIcon />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[82%] max-w-sm bg-surface text-ink p-6 overflow-y-auto animate-fadeUp">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display text-xl">Pak Essentials</span>
              <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="p-1">
                <CloseIcon />
              </button>
            </div>
            <Link href="/products" onClick={() => setMobileOpen(false)} className="block py-3 border-b border-line/10 font-medium">
              All products
            </Link>
            <p className="mt-6 mb-2 text-[11px] uppercase tracking-widest2 text-gold-dark">Categories</p>
            {categories.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} onClick={() => setMobileOpen(false)} className="block py-2.5 border-b border-line/10">
                {c.name}
              </Link>
            ))}

            <div className="mt-8 pt-6 border-t border-line/10 flex items-center justify-between">
              <span className="text-sm text-muted">Appearance</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

/* --- Small inline icon components (no external icon library needed) --- */
function BarsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 8h12l1 13H5L6 8Z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}
