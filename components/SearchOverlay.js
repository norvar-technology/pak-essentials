'use client';

/**
 * components/SearchOverlay.js
 * ---------------------------------------------------------------------------
 * A full-screen search overlay that filters `data/products.js` ENTIRELY IN
 * THE BROWSER — there is no search API route, no database, no network
 * request. Because the whole catalog is already a small JS array bundled
 * into the page, we can just `.filter()` it on every keystroke.
 *
 * Matching logic checks: product name, brand, category name, short
 * description, and skin concern tags — so searching "oily" or "vitamin c"
 * or "Lumen Skin" all return sensible results.
 *
 * This is intentionally a simple substring search rather than a fuzzy-match
 * library, to keep the site dependency-free and instant. If your catalog
 * grows into the hundreds of products, consider swapping this filter logic
 * for a small client-side search library (e.g. Fuse.js) — the rest of the
 * component (the UI) would not need to change.
 */

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { r2Image } from '@/lib/images';
import { formatNaira } from '@/lib/format';

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('');

  // Reset the query each time the overlay is closed, so it opens fresh.
  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  // Lock background scroll while the overlay is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const categoryNameBySlug = useMemo(() => {
    const map = {};
    categories.forEach((c) => (map[c.slug] = c.name));
    return map;
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => {
        const haystack = [
          p.name,
          p.brand,
          categoryNameBySlug[p.category],
          p.shortDescription,
          ...(p.skinConcerns || []),
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 8); // cap results shown in the overlay for a clean UI
  }, [query, categoryNameBySlug]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-start justify-center px-4 pt-20 sm:pt-28">
      <button aria-label="Close search" className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-surface rounded-xl2 shadow-card overflow-hidden animate-fadeUp">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-ink/10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-ink/50 shrink-0">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, or concerns (e.g. “vitamin c”, “oily skin”)"
            className="flex-1 bg-transparent outline-none text-base placeholder:text-ink/40"
          />
          <button onClick={onClose} aria-label="Close search" className="text-ink/50 hover:text-ink shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto slim-scrollbar">
          {query.trim() && results.length === 0 && (
            <p className="px-5 py-10 text-center text-ink/50 text-sm">
              No products match “{query}”. Try a category or ingredient name.
            </p>
          )}

          {results.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="flex items-center gap-4 px-5 py-3 hover:bg-gold-soft/40 transition-colors"
            >
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-surfacealt shrink-0">
                <Image
                  src={r2Image(product.images?.[0])}
                  alt={product.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">{product.name}</p>
                <p className="text-xs text-ink/50 truncate">
                  {product.brand} · {categoryNameBySlug[product.category]}
                </p>
              </div>
              <span className="ml-auto text-sm font-medium text-gold-dark shrink-0">
                {formatNaira(product.price)}
              </span>
            </Link>
          ))}

          {!query.trim() && (
            <div className="px-5 py-6">
              <p className="text-[11px] uppercase tracking-widest2 text-ink/40 mb-3">Popular categories</p>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 6).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    onClick={onClose}
                    className="text-sm px-3 py-1.5 rounded-full border border-ink/15 hover:border-gold hover:text-gold-dark transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
