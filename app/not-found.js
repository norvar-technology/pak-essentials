import Link from 'next/link';
import RingBadge from '@/components/RingBadge';

/**
 * app/not-found.js
 * ---------------------------------------------------------------------------
 * Shown automatically by Next.js for any unmatched route, and whenever a
 * page calls notFound() (e.g. an unknown product slug or category slug).
 */
export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-28 text-center">
      <RingBadge size={56} className="text-gold mx-auto mb-6" />
      <h1 className="font-display text-3xl mb-3">We couldn&apos;t find that page</h1>
      <p className="text-ink/55 mb-8">
        The page you&apos;re looking for may have moved or the product may no longer be available.
      </p>
      <Link
        href="/products"
        className="inline-block bg-ink text-bg px-8 py-3.5 rounded-full uppercase tracking-widest2 text-[13px] hover:bg-gold-dark transition-colors"
      >
        Continue shopping
      </Link>
    </div>
  );
}
