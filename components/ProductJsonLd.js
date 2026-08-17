/**
 * components/ProductJsonLd.js
 * ---------------------------------------------------------------------------
 * Renders a <script type="application/ld+json"> tag describing the product
 * using schema.org's "Product" vocabulary.
 *
 * WHY THIS MATTERS
 * Meta tags (see lib/seo.js) tell a crawler how to SUMMARISE a page as a
 * link card. Structured data (JSON-LD) tells it the actual FACTS: exact
 * price, currency, availability, brand, rating — in a machine-readable
 * format specifically designed to be lifted verbatim into search results,
 * shopping panels, and AI answers ("Pak Essentials sells the Invisible
 * Shield SPF 50 for ₦13,800, in stock"). This is the single highest-leverage
 * thing you can add for "AI bot crawling, understanding and recommendation".
 *
 * Full reference: https://schema.org/Product
 */
import { r2Image } from '@/lib/images';
import { SITE_URL } from '@/lib/seo';

export default function ProductJsonLd({ product }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    category: product.category,
    image: (product.images || []).map((img) => r2Image(img)),
    url: `${SITE_URL}/products/${product.slug}`,
    ...(product.rating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount || 1,
          },
        }
      : {}),
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: 'NGN',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
