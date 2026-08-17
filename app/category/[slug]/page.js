import { notFound } from 'next/navigation';
import { categories, getCategoryBySlug } from '@/data/categories';
import { getProductsByCategory } from '@/data/products';
import { buildCategoryMetadata } from '@/lib/seo';
import ProductGrid from '@/components/ProductGrid';
import Link from 'next/link';

/**
 * app/category/[slug]/page.js
 * ---------------------------------------------------------------------------
 * One statically-generated page per category (11 pages total, from
 * data/categories.js). Each has its own unique title/description (via
 * buildCategoryMetadata) so category pages are genuinely useful, distinct
 * landing pages for both SEO and paid-traffic use, not just a filtered
 * view of /products.
 */

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) return {};
  return buildCategoryMetadata(category);
}

export default function CategoryPage({ params }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const categoryProducts = getProductsByCategory(category.slug);

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-ink/45 mb-6">
        <Link href="/products" className="hover:text-gold-dark">All products</Link>
        <span className="mx-2">/</span>
        <span className="text-ink/70">{category.name}</span>
      </nav>

      <div className="mb-8 max-w-2xl">
        <h1 className="font-display text-3xl sm:text-4xl mb-3">{category.name}</h1>
        <p className="text-ink/60 leading-relaxed">{category.blurb}</p>
      </div>

      {/* Sibling-category quick links, helps both users and crawlers
          discover the full taxonomy from any single category page. */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories
          .filter((c) => c.slug !== category.slug)
          .map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="text-sm px-3.5 py-1.5 rounded-full border border-ink/15 hover:border-gold hover:text-gold-dark transition-colors"
            >
              {c.name}
            </Link>
          ))}
      </div>

      <ProductGrid
        products={categoryProducts}
        emptyMessage={`No ${category.name.toLowerCase()} in stock right now — check back soon.`}
      />
    </div>
  );
}
