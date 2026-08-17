'use client';

/**
 * app/cart/page.js
 * ---------------------------------------------------------------------------
 * A dedicated, full-page cart view — useful for sharing/bookmarking and for
 * shoppers who land here directly (e.g. from a "View bag" link) rather than
 * using the slide-out <CartDrawer>. Reads/writes the same CartContext, so
 * it always stays in sync with the drawer.
 */

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { r2Image } from '@/lib/images';
import { formatNaira } from '@/lib/format';

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl sm:text-4xl mb-8">Your bag</h1>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-ink/55 mb-6">Your bag is empty.</p>
          <Link
            href="/products"
            className="inline-block bg-ink text-bg px-8 py-3.5 rounded-full uppercase tracking-widest2 text-[13px] hover:bg-gold-dark transition-colors"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 divide-y divide-ink/10 border-t border-b border-ink/10">
            {items.map((line) => (
              <div key={line.id} className="flex gap-4 py-5">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-surfacealt shrink-0">
                  <Image src={r2Image(line.image)} alt={line.name} fill sizes="96px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{line.name}</p>
                  <p className="text-xs text-ink/50">{line.brand} {line.size ? `· ${line.size}` : ''}</p>
                  <p className="font-display text-gold-dark mt-1">{formatNaira(line.price)}</p>

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border border-ink/15 rounded-full">
                      <button aria-label="Decrease quantity" className="w-8 h-8" onClick={() => updateQty(line.id, line.qty - 1)}>−</button>
                      <span className="w-8 text-center text-sm">{line.qty}</span>
                      <button aria-label="Increase quantity" className="w-8 h-8" onClick={() => updateQty(line.id, line.qty + 1)}>+</button>
                    </div>
                    <button className="text-xs text-ink/40 hover:text-red-500 underline underline-offset-2" onClick={() => removeItem(line.id)}>
                      Remove
                    </button>
                  </div>
                </div>
                <p className="font-display shrink-0">{formatNaira(line.price * line.qty)}</p>
              </div>
            ))}
          </div>

          <div className="border border-ink/10 rounded-xl2 p-6 h-max sticky top-24">
            <h2 className="font-display text-xl mb-4">Order summary</h2>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-ink/60">Subtotal</span>
              <span>{formatNaira(subtotal)}</span>
            </div>
            <p className="text-xs text-ink/45 mb-5">Delivery fee is calculated at checkout.</p>
            <Link
              href="/checkout"
              className="block w-full text-center bg-ink text-bg py-3.5 rounded-full uppercase tracking-widest2 text-[13px] hover:bg-gold-dark transition-colors"
            >
              Proceed to checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
