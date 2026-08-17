'use client';

/**
 * context/CartContext.js
 * ---------------------------------------------------------------------------
 * A lightweight shopping cart implemented entirely in the browser using
 * React Context + localStorage. There is NO server-side cart/database:
 * everything the customer adds lives in their own browser until checkout,
 * which fits the "frontend-only" requirement perfectly.
 *
 * WHAT'S STORED PER LINE ITEM
 * We intentionally store a *snapshot* of the product's name/price/size/
 * image at the moment it was added (not just a productId) so that:
 *   1. The cart still renders correctly even if you later edit or remove
 *      that product from data/products.js.
 *   2. The WhatsApp order message (see lib/whatsapp.js) always reflects
 *      exactly what the customer paid for.
 *
 * HOW OTHER COMPONENTS USE THIS
 *   const { items, addItem, removeItem, updateQty, subtotal, clearCart } = useCart();
 * Wrapped around the whole app once, in app/layout.js.
 */

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'pak-essentials-cart-v1';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Load any previously saved cart from localStorage once, on first mount.
  // (Guarded so this never runs during server-side rendering, where
  // `window`/`localStorage` don't exist.)
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch (err) {
      console.warn('Could not read cart from localStorage:', err);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist to localStorage every time the cart changes, after the initial
  // load has completed (avoids overwriting saved data with an empty array
  // during the very first render).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn('Could not save cart to localStorage:', err);
    }
  }, [items, hydrated]);

  /** Add a product to the cart, or bump its quantity if already present. */
  function addItem(product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((line) => line.id === product.id);
      if (existing) {
        return prev.map((line) =>
          line.id === product.id ? { ...line, qty: line.qty + qty } : line
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          price: product.price,
          size: product.size,
          image: product.images?.[0],
          qty,
        },
      ];
    });
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((line) => line.id !== id));
  }

  /** Set an exact quantity; removes the line entirely if qty drops to 0. */
  function updateQty(id, qty) {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((line) => (line.id === id ? { ...line, qty } : line)));
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = useMemo(
    () => items.reduce((sum, line) => sum + line.price * line.qty, 0),
    [items]
  );

  const itemCount = useMemo(() => items.reduce((sum, line) => sum + line.qty, 0), [items]);

  const value = { items, addItem, removeItem, updateQty, clearCart, subtotal, itemCount, hydrated };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Hook every component uses to read/mutate the cart. */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart() must be used inside a <CartProvider>');
  return ctx;
}
