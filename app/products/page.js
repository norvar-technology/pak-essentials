import ProductGrid from '@/components/ProductGrid';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { buildMetadata } from '@/lib/seo';
import Link from 'next/link';

/**
 * app/products/page.js
 * ---------------------------------------------------------------------------
 * The full catalog page. Server component that renders every product; the
 * interactive sort control lives inside <ProductGrid> (a client component),
 * so this page itself ships no extra client JS beyond that.
 */

export const metadata = buildMetadata({
  title: 'All Products | Pak Essentials',
  description:
    'Browse the full Pak Essentials catalog — authentic third-party skincare, body-care and wellness, from face creams to body oils, toners to supplements.',
  path: '/products',
});

export default function AllProductsPage() {
  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-widest2 text-gold-dark mb-2">Full catalog</p>
        <h1 className="font-display text-3xl sm:text-4xl mb-4">All products</h1>

        {/* Quick category filter pills — plain links to the dedicated
            category pages, which keeps this page fast and crawlable
            (a real <a href> per category, not a client-only filter). */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="text-sm px-3.5 py-1.5 rounded-full border border-ink/15 hover:border-gold hover:text-gold-dark transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
