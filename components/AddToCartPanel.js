'use client';

/**
 * components/AddToCartPanel.js
 * ---------------------------------------------------------------------------
 * The only interactive part of the product detail page: a quantity stepper
 * and "Add to bag" button. Split out as its own small client component so
 * the rest of app/products/[slug]/page.js can stay a server component
 * (better for SEO/performance — the product description, price, images,
 * etc. are all rendered on the server).
 */

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatNaira } from '@/lib/format';

export default function AddToCartPanel({ product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (!product.inStock) {
    return (
      <div className="mt-8">
        <button disabled className="w-full sm:w-auto px-10 py-4 rounded-full bg-ink/10 text-ink/40 uppercase tracking-widest2 text-[13px] cursor-not-allowed">
          Sold out
        </button>
        <p className="text-sm text-ink/45 mt-3">This item is currently unavailable. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-center border border-ink/15 rounded-full w-max">
        <button
          aria-label="Decrease quantity"
          className="w-11 h-11 flex items-center justify-center text-lg"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
        >
          −
        </button>
        <span className="w-8 text-center">{qty}</span>
        <button
          aria-label="Increase quantity"
          className="w-11 h-11 flex items-center justify-center text-lg"
          onClick={() => setQty((q) => q + 1)}
        >
          +
        </button>
      </div>

      <button
        onClick={handleAdd}
        className="flex-1 sm:flex-none sm:px-10 py-4 rounded-full bg-ink text-bg uppercase tracking-widest2 text-[13px] hover:bg-gold-dark transition-colors"
      >
        {added ? 'Added to bag ✓' : `Add to bag — ${formatNaira(product.price * qty)}`}
      </button>
    </div>
  );
}
