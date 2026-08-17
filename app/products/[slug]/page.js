import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProductsByCategory, products } from '@/data/products';
import { getCategoryBySlug } from '@/data/categories';
import { r2Image } from '@/lib/images';
import { formatNaira } from '@/lib/format';
import { buildProductMetadata } from '@/lib/seo';
import ProductJsonLd from '@/components/ProductJsonLd';
import AddToCartPanel from '@/components/AddToCartPanel';
import ProductGrid from '@/components/ProductGrid';
import Link from 'next/link';

/**
 * app/products/[slug]/page.js
 * ---------------------------------------------------------------------------
 * The product detail page (PDP) — the single most important page for SEO
 * and AI-recommendation purposes, since it's what actually gets linked to
 * and cited. It:
 *   - Statically pre-renders one page per product (generateStaticParams),
 *     so every product has a real, crawlable, independently-indexable URL.
 *   - Sets unique <title>/description/OG image via buildProductMetadata().
 *   - Emits schema.org Product JSON-LD via <ProductJsonLd> with exact price,
 *     availability, and brand — the facts an AI system would want to quote.
 *   - Shows a related-products rail from the same category.
 */

// Pre-render a static page for every product at build time.
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  return buildProductMetadata(product);
}

export default function ProductPage({ params }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.category);
  const related = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 py-10">
      {/* Structured data for search engines & AI systems — invisible to the
          human visitor, read by crawlers. */}
      <ProductJsonLd product={product} />

      {/* Breadcrumb — also helps AI systems understand where this product
          sits in your taxonomy. */}
      <nav className="text-sm text-ink/45 mb-8 flex items-center gap-2 flex-wrap">
        <Link href="/products" className="hover:text-gold-dark">All products</Link>
        <span>/</span>
        {category && (
          <>
            <Link href={`/category/${category.slug}`} className="hover:text-gold-dark">{category.name}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-ink/70">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-xl2 overflow-hidden bg-surfacealt">
            <Image
              src={r2Image(product.images?.[0])}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(1).map((img) => (
                <div key={img} className="relative aspect-square rounded-lg overflow-hidden bg-surfacealt">
                  <Image src={r2Image(img)} alt={product.name} fill sizes="120px" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-[11px] uppercase tracking-widest2 text-ink/45 mb-2">{product.brand}</p>
          <h1 className="font-display text-3xl sm:text-4xl mb-3">{product.name}</h1>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-display text-2xl text-gold-dark">{formatNaira(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-ink/35 line-through">{formatNaira(product.compareAtPrice)}</span>
            )}
            {product.size && <span className="text-sm text-ink/45">· {product.size}</span>}
          </div>

          {product.rating && (
            <p className="text-sm text-ink/55 mb-6">
              ★ {product.rating.toFixed(1)} · {product.reviewCount} reviews
            </p>
          )}

          <p className="text-ink/70 leading-relaxed">{product.description}</p>

          {product.skinConcerns?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {product.skinConcerns.map((tag) => (
                <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-sage/10 text-sage-light border border-sage/20">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {product.keyIngredients?.length > 0 && (
            <div className="mt-6 border-t border-ink/10 pt-6">
              <p className="text-[11px] uppercase tracking-widest2 text-ink/45 mb-2">Key ingredients</p>
              <p className="text-sm text-ink/65">{product.keyIngredients.join(' · ')}</p>
            </div>
          )}

          <AddToCartPanel product={product} />

          <p className="text-xs text-ink/40 mt-4">
            100% authentic, sourced directly from {product.brand}. Delivered across Nigeria.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <p className="text-[11px] uppercase tracking-widest2 text-gold-dark mb-2">You may also like</p>
          <h2 className="font-display text-2xl sm:text-3xl mb-6">More from {category?.name}</h2>
          <ProductGrid products={related} showSort={false} />
        </section>
      )}
    </div>
  );
}
