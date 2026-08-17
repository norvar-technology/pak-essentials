/**
 * data/categories.js
 * ---------------------------------------------------------------------------
 * The full category taxonomy for Pak Essentials, as ONE source of truth —
 * these are the verified categories the store sells.
 *
 * Every other part of the app (header nav, homepage category sections,
 * the /category/[slug] pages, search filters, and the sitemap) reads from
 * this array instead of hard-coding category names in multiple places. To
 * rename, add, or remove a category, edit it here and everything updates
 * automatically.
 *
 * FIELDS
 * - slug   : URL-safe id, used in /category/[slug] and as the value stored
 *            on each product in data/products.js (product.category).
 * - name   : human-readable label shown in the UI.
 * - blurb  : one short line shown on category landing pages & used as the
 *            meta description for that page (good for SEO + AI crawlers).
 */
export const categories = [
  {
    slug: 'body-lotion',
    name: 'Body Lotion',
    blurb: 'Fast-absorbing, all-day moisture for soft, smooth skin from neck to toe.',
    image: 'products/body-lotion-category.png',
  },
  {
    slug: 'body-washes',
    name: 'Body Washes',
    blurb: 'Creamy, fragrant cleansers that leave skin soft — never tight or dry — after every shower.',
    image: 'products/body-wash-category-v1.png',
  },
  {
    slug: 'body-oils',
    name: 'Body Oils',
    blurb: 'Nourishing dry and massage oils that seal in moisture and add a healthy, natural glow.',
    image: 'products/body-oil-category.png',
  },
  {
    slug: 'face-creams',
    name: 'Face Creams',
    blurb: 'Everyday and night moisturizers that lock in hydration and keep skin soft all day.',
    image: 'products/face-cream-category.png',
  },
  {
    slug: 'face-toners',
    name: 'Face Toners',
    blurb: 'Alcohol-free toners that rebalance skin pH and prep the face for serums and moisturizer.',
    image: 'products/face-toner-category.png',
  },
  {
    slug: 'supplements-wellness',
    name: 'Supplements & Wellness',
    blurb: 'Everyday wellness support — vitamins, collagen and gut-health supplements to complement your skincare routine.',
    image: 'products/supplemnts-and-wellness-category.png',
  },
];

/** Convenience lookup: getCategoryBySlug('body-oils') -> category object */
export function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug);
}
