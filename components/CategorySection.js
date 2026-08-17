import Link from 'next/link';
import ProductCard from './ProductCard';

/**
 * components/CategorySection.js
 * ---------------------------------------------------------------------------
 * Renders ONE category's row on the homepage: a heading, a short blurb, up
 * to 5 products, and a "See more" card/link pointing to the full
 * `/category/[slug]` page (which lists everything in that category, not
 * just the first 5). Used once per category in app/page.js so every
 * category gets homepage visibility, per the brief.
 */
export default function CategorySection({ category, products }) {
  const preview = products.slice(0, 5);
  const hasMore = products.length > preview.length;

  return (
    <section className="max-w-content mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-end justify-between mb-6 gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest2 text-gold-dark mb-2">Shop the edit</p>
          <h2 className="font-display text-2xl sm:text-3xl">{category.name}</h2>
          <p className="text-muted text-sm mt-1 max-w-lg">{category.blurb}</p>
        </div>
        <Link
          href={`/category/${category.slug}`}
          className="hidden sm:inline-flex shrink-0 items-center gap-1.5 text-[13px] uppercase tracking-widest2 text-gold-dark border-b border-gold-dark/60 pb-0.5 hover:border-gold-dark transition-colors"
        >
          See all
        </Link>
      </div>

      {preview.length === 0 ? (
        <p className="text-muted text-sm">More {category.name.toLowerCase()} coming soon.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-10">
          {preview.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Mobile-only "See more" button (desktop uses the "See all" link above) */}
      {hasMore && (
        <div className="mt-8 sm:hidden">
          <Link
            href={`/category/${category.slug}`}
            className="block w-full text-center border border-ink/15 py-3 rounded-full uppercase tracking-widest2 text-[13px] hover:border-gold-dark hover:text-gold-dark transition-colors"
          >
            See more {category.name}
          </Link>
        </div>
      )}
    </section>
  );
}
