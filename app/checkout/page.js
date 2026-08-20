'use client';

/**
 * app/checkout/page.js
 * ---------------------------------------------------------------------------
 * The checkout flow, entirely client-side:
 *   1. Shopper fills in delivery details (name, phone, email, address).
 *   2. On submit, we open Paystack's INLINE popup (loaded via <Script> from
 *      Paystack's own CDN — no backend "initialize transaction" call
 *      needed) configured with `channels: ['bank_transfer']` so bank
 *      transfer is the ONLY payment method shown, per the brief.
 *   3. Before opening the popup we save a snapshot of the order (items,
 *      total, customer info, reference) to localStorage. We do this
 *      BEFORE payment completes so /order-success can rebuild the WhatsApp
 *      message even if the browser tab reloads during the bank-transfer
 *      confirmation step.
 *   4. Paystack's callback fires once the customer completes the transfer
 *      in the popup; we then navigate to /order-success?reference=...,
 *      where a Vercel serverless function (app/api/verify-payment) confirms
 *      the payment really succeeded before we tell the customer it did.
 *
 * IMPORTANT: never trust the client-side "success" callback alone — always
 * re-verify server-side with your SECRET key. That verification happens on
 * the next page, not here.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { r2Image } from '@/lib/images';
import { formatNaira, nairaToKobo } from '@/lib/format';

const PENDING_ORDER_KEY = 'pak-essentials-pending-order';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [scriptReady, setScriptReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '' });

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email (Paystack requires one)';
    if (!/^\d{10,11}$/.test(form.phone.replace(/\D/g, ''))) nextErrors.phone = 'Enter a valid phone number';
    if (!form.address.trim()) nextErrors.address = 'Enter your delivery address';
    if (!form.city.trim()) nextErrors.city = 'Enter your city / state';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handlePayment(e) {
    e.preventDefault();
    if (items.length === 0) return;
    if (!validate()) return;
    if (!scriptReady || !window.PaystackPop) {
      alert('Payment is still loading, please try again in a moment.');
      return;
    }

    setSubmitting(true);

    const reference = `PE-${Date.now()}`;

    const pendingOrder = {
      reference,
      items: items.map((line) => ({ name: line.name, size: line.size, price: line.price, qty: line.qty })),
      total: subtotal,
      customer: { name: form.name, phone: form.phone, address: `${form.address}, ${form.city}` },
    };
    window.localStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(pendingOrder));

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: form.email,
      amount: nairaToKobo(subtotal),
      currency: 'NGN',
      ref: reference,
      metadata: {
        custom_fields: [
          { display_name: 'Customer Name', variable_name: 'customer_name', value: form.name },
          { display_name: 'Phone', variable_name: 'phone', value: form.phone },
          { display_name: 'Delivery Address', variable_name: 'address', value: `${form.address}, ${form.city}` },
        ],
      },
      callback: function onSuccess(response) {
        clearCart();
        router.push(`/order-success?reference=${response.reference}`);
      },
      onClose: function onClose() {
        setSubmitting(false);
      },
    });

    handler.openIframe();
  }

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 py-12 overflow-x-hidden">
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />

      <h1 className="font-display text-3xl sm:text-4xl mb-8">Checkout</h1>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-ink/55 mb-6">Your bag is empty — add something before checking out.</p>
          <Link href="/products" className="inline-block bg-ink text-bg px-8 py-3.5 rounded-full uppercase tracking-widest2 text-[13px]">
            Shop products
          </Link>
        </div>
      ) : (
        // grid-cols-1 is set explicitly (not just implied) so each grid
        // item's width is locked to a single column on mobile — CSS Grid
        // items default to min-width:auto, which without an explicit
        // column count can force the page (and everything sharing the
        // document, including the header/footer) wider than the viewport.
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <form onSubmit={handlePayment} className="lg:col-span-2 space-y-5 min-w-0">
            <h2 className="font-display text-xl mb-1">Delivery details</h2>

            <Field label="Full name" error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="input-field"
                placeholder="Jane Doe"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Email" error={errors.email} hint="Required by Paystack for your receipt">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="input-field"
                  placeholder="jane@email.com"
                />
              </Field>
              <Field label="Phone number" error={errors.phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="input-field"
                  placeholder="080X XXX XXXX"
                />
              </Field>
            </div>

            <Field label="Delivery address" error={errors.address}>
              <input
                type="text"
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="input-field"
                placeholder="Street address"
              />
            </Field>

            <Field label="City / State" error={errors.city}>
              <input
                type="text"
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                className="input-field"
                placeholder="e.g. Port Harcourt, Rivers"
              />
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto mt-4 bg-ink text-bg px-10 py-4 rounded-full uppercase tracking-widest2 text-[13px] hover:bg-gold-dark transition-colors disabled:opacity-50"
            >
              {submitting ? 'Opening secure payment…' : `Pay ${formatNaira(subtotal)} via bank transfer`}
            </button>
            <p className="text-xs text-ink/40">
              Payment is processed securely by Paystack.
            </p>
          </form>

          <div className="border border-ink/10 rounded-xl2 p-6 h-max min-w-0">
            <h2 className="font-display text-xl mb-4">Order summary</h2>
            <div className="space-y-4 max-h-72 overflow-y-auto slim-scrollbar pr-1">
              {items.map((line) => (
                <div key={line.id} className="flex gap-3 min-w-0">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-surfacealt shrink-0">
                    <Image src={r2Image(line.image)} alt={line.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 text-sm">
                    <p className="truncate">{line.name}</p>
                    <p className="text-ink/45">Qty {line.qty}</p>
                  </div>
                  <p className="text-sm shrink-0">{formatNaira(line.price * line.qty)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-ink/10 mt-4 pt-4 flex items-center justify-between">
              <span className="text-ink/60 text-sm">Total</span>
              <span className="font-display text-xl text-gold-dark">{formatNaira(subtotal)}</span>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .input-field {
          width: 100%;
          border: 1px solid rgba(var(--c-line), 0.18);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          background: transparent;
          color: rgb(var(--c-ink));
          outline: none;
        }
        .input-field:focus {
          border-color: #b99657;
        }
      `}</style>
    </div>
  );
}

/** Small labeled form-field wrapper shared by every input above. */
function Field({ label, error, hint, children }) {
  return (
    <label className="block min-w-0">
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      {children}
      {hint && !error && <span className="block text-xs text-ink/40 mt-1">{hint}</span>}
      {error && <span className="block text-xs text-red-500 mt-1">{error}</span>}
    </label>
  );
}