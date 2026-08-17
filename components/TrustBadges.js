import RingBadge from './RingBadge';

/**
 * components/TrustBadges.js
 * ---------------------------------------------------------------------------
 * A row of short trust signals, using the small ring glyph to tie back to
 * the brand mark instead of generic stock icons. Placed on the homepage,
 * just above the footer, where shoppers weigh "should I buy from this
 * store" — genuine third-party goods + secure payment + real delivery.
 */

const badges = [
  { title: '100% Authentic', body: 'Every product is genuine, sourced directly from trusted third-party brands.' },
  { title: 'Secure Payment', body: 'Checkout is processed securely by Paystack via bank transfer.' },
  { title: 'Nationwide Delivery', body: 'We deliver across Nigeria, with order updates sent straight to WhatsApp.' },
];

export default function TrustBadges() {
  return (
    <section className="bg-surfacealt border-y border-ink/10">
      <div className="max-w-content mx-auto px-4 sm:px-6 py-14 grid sm:grid-cols-3 gap-10">
        {badges.map((b) => (
          <div key={b.title} className="flex flex-col items-start">
            <RingBadge size={36} className="text-gold-dark mb-4" />
            <p className="font-display text-lg mb-1.5">{b.title}</p>
            <p className="text-sm text-ink/55 leading-relaxed max-w-xs">{b.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
