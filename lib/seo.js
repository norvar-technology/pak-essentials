/**
 * lib/seo.js
 * ---------------------------------------------------------------------------
 * Centralised helpers for building Next.js `metadata` objects (which Next
 * turns into <title>, <meta name="description">, Open Graph tags, Twitter
 * Card tags, and canonical URLs).
 *
 * WHY THIS MATTERS FOR "AI CRAWLING & RECOMMENDATION"
 * Both search engines and AI answer-engines (ChatGPT browsing, Perplexity,
 * Google AI Overviews, etc.) rely heavily on:
 *   1. A unique, descriptive <title> and meta description per page.
 *   2. Open Graph tags (og:title, og:description, og:image, og:type) so the
 *      page can be summarised and shown as a rich card when referenced.
 *   3. A canonical URL so duplicate content isn't split across variants.
 *   4. Structured data (see components/ProductJsonLd.js) describing exactly
 *      what the entity IS — here, "Product" with price/brand/availability.
 * Every product & category page in this app calls one of these helpers, so
 * that coverage is automatic and consistent site-wide.
 */

import { r2Image } from './images';

export const SITE_NAME = 'Pak Essentials';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pakessentials.com';
export const DEFAULT_OG_IMAGE = r2Image('products/pak-essentials-logo.jpg?v=2');

/**
 * Build a full Next.js metadata object for a generic page.
 */
export function buildMetadata({ title, description, path = '/', image, type = 'website' }) {
  const url = `${SITE_URL}${path}`;
  const ogImage = image || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type,
      locale: 'en_NG',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Metadata specifically for a product detail page — pulls the product's own
 * name/description/first image/price into the tags so each product page is
 * unique (never duplicate boilerplate across products, which hurts both
 * classic SEO and how confidently an AI system can describe/recommend it).
 */
export function buildProductMetadata(product) {
  const title = `${product.name} by ${product.brand} | ${SITE_NAME}`;
  const description = `${product.shortDescription} ${product.size ? `(${product.size})` : ''} — ₦${product.price.toLocaleString('en-NG')}. Shop authentic ${product.brand} at Pak Essentials.`;
  return buildMetadata({
    title,
    description,
    path: `/products/${product.slug}`,
    image: r2Image(product.images?.[0]),
    type: 'website',
  });
}

/**
 * Metadata for a category landing page.
 */
export function buildCategoryMetadata(category) {
  const title = `${category.name} | Shop ${SITE_NAME}`;
  const description = `${category.blurb} Browse authentic, third-party ${category.name.toLowerCase()} at Pak Essentials.`;
  return buildMetadata({
    title,
    description,
    path: `/category/${category.slug}`,
    image: r2Image(category.image),
  });
}
