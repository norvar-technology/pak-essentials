'use client';

/**
 * components/CartDrawer.js
 * ---------------------------------------------------------------------------
 * Slide-out panel showing the current cart (from CartContext). Lets the
 * shopper adjust quantities or remove a line, then proceeds to /checkout.
 * Purely presentational — all cart logic lives in context/CartContext.js.
 */

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { r2Image } from '@/lib/images';
import { formatNaira } from '@/lib/format';

export default function CartDrawer({ open, onClose }) {
  const { items, updateQty, removeItem, subtotal } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button aria-label="Close cart" className="absolute inset-0 bg-ink/60" onClick={onClose} />

      <div className="relative w-full max-w-md bg-surface h-full flex flex-col shadow-card animate-fadeUp">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10">
          <h2 className="font-display text-xl">Your bag {items.length > 0 && `(${items.length})`}</h2>
          <button aria-label="Close cart" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <p className="text-ink/60 mb-4">Your bag is empty.</p>
            <Link
              href="/products"
              onClick={onClose}
              className="text-sm uppercase tracking-widest2 text-gold-dark border-b border-gold-dark pb-0.5"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto slim-scrollbar px-5 divide-y divide-ink/10">
              {items.map((line) => (
                <div key={line.id} className="flex gap-4 py-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-surfacealt shrink-0">
                    <Image src={r2Image(line.image)} alt={line.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{line.name}</p>
                    <p className="text-xs text-ink/50">{line.brand} {line.size ? `· ${line.size}` : ''}</p>
                    <p className="text-sm font-medium text-gold-dark mt-1">{formatNaira(line.price)}</p>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-ink/15 rounded-full">
                        <button
                          aria-label="Decrease quantity"
                          className="w-7 h-7 flex items-center justify-center"
                          onClick={() => updateQty(line.id, line.qty - 1)}
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm">{line.qty}</span>
                        <button
                          aria-label="Increase quantity"
                          className="w-7 h-7 flex items-center justify-center"
                          onClick={() => updateQty(line.id, line.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="text-xs text-ink/40 hover:text-red-500 underline underline-offset-2"
                        onClick={() => removeItem(line.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-ink/10 px-5 py-5 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink/60">Subtotal</span>
                <span className="font-display text-lg">{formatNaira(subtotal)}</span>
              </div>
              <p className="text-xs text-ink/45">Delivery fee is calculated at checkout.</p>
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full text-center bg-ink text-bg py-3.5 rounded-full uppercase tracking-widest2 text-[13px] hover:bg-gold-dark transition-colors"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
