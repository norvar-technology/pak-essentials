import Hero from '@/components/Hero';
import CategoryStrip from '@/components/CategoryStrip';
import TrustBadges from '@/components/TrustBadges';
import CategorySection from '@/components/CategorySection';
import { categories } from '@/data/categories';
import { getProductsByCategory } from '@/data/products';

/**
 * app/page.js
 * ---------------------------------------------------------------------------
 * The homepage. Server component (no 'use client') — it just composes other
 * components and passes plain data down, so it renders on the server with
 * zero client JS of its own (the interactive bits live inside ProductCard /
 * Header, which are their own client components).
 *
 * Per the brief: every category gets its own homepage section, showing up
 * to 5 products with a "See more" link to that category's full page —
 * rather than a single mixed "Editor's Picks" rail.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryStrip />

      <div className="divide-y divide-line/10">
        {categories.map((category) => (
          <CategorySection
            key={category.slug}
            category={category}
            products={getProductsByCategory(category.slug)}
          />
        ))}
      </div>

      <TrustBadges />
    </>
  );
}
