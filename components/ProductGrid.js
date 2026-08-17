'use client';

/**
 * components/ProductGrid.js
 * ---------------------------------------------------------------------------
 * Renders a responsive grid of <ProductCard>s. Optionally renders a small
 * sort control above the grid (used on /products and /category/[slug]).
 * All sorting happens client-side over the array already passed in — no
 * network requests, consistent with the rest of the frontend-only site.
 */

import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A–Z' },
];

export default function ProductGrid({ products, showSort = true, emptyMessage = 'No products found.' }) {
  const [sort, setSort] = useState('featured');

  const sorted = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      default:
        // "Featured" — featured products first, otherwise keep catalog order.
        return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [products, sort]);

  return (
    <div>
      {showSort && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-ink/50">{products.length} product{products.length === 1 ? '' : 's'}</p>
          <label className="text-sm flex items-center gap-2">
            <span className="text-ink/50 hidden sm:inline">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent border border-ink/15 rounded-full px-3 py-1.5 text-sm outline-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      {sorted.length === 0 ? (
        <p className="text-center text-ink/50 py-20">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
