'use client';

/**
 * components/ProductCard.js
 * ---------------------------------------------------------------------------
 * A single product tile: image, brand, name, price, and a quick "Add to
 * cart" action. Used everywhere a list of products is rendered (homepage
 * rails, category pages, /products, search results grid).
 */

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { r2Image } from '@/lib/images';
import { formatNaira } from '@/lib/format';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd(e) {
    e.preventDefault(); // don't follow the wrapping <Link> to the PDP
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  }

  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] rounded-xl2 overflow-hidden bg-surfacealt">
        <Image
          src={r2Image(product.images?.[0])}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
        />

        {onSale && (
          <span className="absolute top-3 left-3 bg-gold text-bg text-[10px] uppercase tracking-widest2 px-2.5 py-1 rounded-full">
            Sale
          </span>
        )}
        {!product.inStock && (
          <span className="absolute top-3 left-3 bg-ink/80 text-bg text-[10px] uppercase tracking-widest2 px-2.5 py-1 rounded-full">
            Sold out
          </span>
        )}

        {product.inStock && (
          <button
            onClick={handleAdd}
            className="absolute bottom-3 right-3 bg-surface/95 text-ink text-[11px] uppercase tracking-widest2 px-3.5 py-2 rounded-full opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 shadow-card"
          >
            {justAdded ? 'Added ✓' : 'Add to bag'}
          </button>
        )}
      </div>

      <div className="mt-3">
        <p className="text-[11px] uppercase tracking-widest2 text-ink/45">{product.brand}</p>
        <h3 className="font-medium leading-snug mt-0.5 truncate">{product.name}</h3>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-display text-gold-dark">{formatNaira(product.price)}</span>
          {onSale && (
            <span className="text-xs text-ink/35 line-through">{formatNaira(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
