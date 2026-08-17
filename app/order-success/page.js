'use client';

/**
 * app/order-success/page.js
 * ---------------------------------------------------------------------------
 * Lands here right after the Paystack popup reports success. This page:
 *   1. Reads the `reference` query param.
 *   2. Calls our own Vercel serverless function, /api/verify-payment, which
 *      asks Paystack's server directly (using the SECRET key) whether that
 *      transaction really did succeed. We never trust the client-side
 *      callback alone — a tampered or replayed client response should never
 *      be enough to show "payment successful".
 *   3. On confirmed success: shows a thank-you message, rebuilds the order
 *      from the snapshot saved in localStorage during checkout, and gives
 *      the customer a "Send my order on WhatsApp" button (also auto-opens
 *      it after a short delay) that hands off to the vendor's WhatsApp with
 *      the full order + Paystack receipt link pre-filled.
 *   4. On failure: shows a clear error and a way to retry / contact support.
 */

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import RingBadge from '@/components/RingBadge';
import { buildOrderWhatsAppUrl } from '@/lib/whatsapp';

const PENDING_ORDER_KEY = 'pak-essentials-pending-order';

// Next.js requires any component that calls useSearchParams() to be
// wrapped in a <Suspense> boundary (it needs to bail out of static
// rendering for the query string). The actual page component is the
// default export below; this just wraps it.
export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<OrderSuccessFallback />}>
      <OrderSuccessContent />
    </Suspense>
  );
}

function OrderSuccessFallback() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
      <RingBadge size={64} spin className="text-gold mx-auto mb-6" />
      <h1 className="font-display text-2xl mb-2">Loading…</h1>
    </div>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'failed'
  const [receiptUrl, setReceiptUrl] = useState(null);
  const [whatsAppUrl, setWhatsAppUrl] = useState(null);
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      return;
    }

    async function verify() {
      try {
        const res = await fetch(`/api/verify-payment?reference=${encodeURIComponent(reference)}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          setStatus('failed');
          return;
        }

        setReceiptUrl(data.receiptUrl || null);

        // Rebuild the order summary from what checkout saved just before
        // opening the Paystack popup.
        const savedRaw = window.localStorage.getItem(PENDING_ORDER_KEY);
        const saved = savedRaw ? JSON.parse(savedRaw) : null;

        const order = {
          items: saved?.items || [],
          total: data.amount != null ? data.amount / 100 : saved?.total || 0,
          reference,
          receiptUrl: data.receiptUrl,
          customer: saved?.customer,
        };

        setWhatsAppUrl(buildOrderWhatsAppUrl(order));
        setStatus('success');

        // Clear the pending-order snapshot now that it's been used, so it
        // doesn't leak into a future, unrelated order.
        window.localStorage.removeItem(PENDING_ORDER_KEY);
      } catch (err) {
        console.error('Payment verification failed:', err);
        setStatus('failed');
      }
    }

    verify();
  }, [reference]);

  // Auto-redirect to WhatsApp a few seconds after success, matching the
  // brief's "wait to be redirected" instruction — but the customer can also
  // just tap the button immediately rather than waiting.
  useEffect(() => {
    if (status !== 'success' || !whatsAppUrl) return;
    if (countdown <= 0) {
      window.location.href = whatsAppUrl;
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, whatsAppUrl, countdown]);

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
      {status === 'verifying' && (
        <>
          <RingBadge size={64} spin className="text-gold mx-auto mb-6" />
          <h1 className="font-display text-2xl mb-2">Confirming your payment…</h1>
          <p className="text-ink/55">This only takes a moment. Please don&apos;t close this tab.</p>
        </>
      )}

      {status === 'success' && (
        <>
          <RingBadge size={64} className="text-gold mx-auto mb-6" />
          <h1 className="font-display text-3xl mb-3">Thank you for your order!</h1>
          <p className="text-ink/60 mb-2">
            Your payment was successful. To process your order, please send it to us on WhatsApp — just tap
            the button below and hit send.
          </p>
          <p className="text-sm text-ink/40 mb-8">
            Redirecting you to WhatsApp automatically in {countdown}s…
          </p>

          <a
            href={whatsAppUrl}
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-full uppercase tracking-widest2 text-[13px] hover:opacity-90 transition-opacity"
          >
            Send my order on WhatsApp
          </a>

          {receiptUrl && (
            <p className="mt-6 text-xs text-ink/40">
              <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="underline">
                View Paystack receipt
              </a>
            </p>
          )}
        </>
      )}

      {status === 'failed' && (
        <>
          <h1 className="font-display text-2xl mb-3 text-red-500">We couldn&apos;t confirm this payment</h1>
          <p className="text-ink/60 mb-8">
            If money left your account, don&apos;t worry — contact us on WhatsApp with your reference (
            {reference || 'not found'}) and we&apos;ll sort it out right away.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/checkout" className="text-sm underline underline-offset-2">Try again</Link>
            <Link href="/" className="text-sm underline underline-offset-2">Back to home</Link>
          </div>
        </>
      )}
    </div>
  );
}
