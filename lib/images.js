/**
 * lib/images.js
 * ---------------------------------------------------------------------------
 * Every product photo lives in your Cloudflare R2 bucket, NOT in this repo.
 * Rather than pasting the full R2 URL into data/products.js for every single
 * image (verbose, and painful to change later if you ever move buckets or
 * add a custom CDN domain), we store only the short object path in
 * products.js — e.g. "products/rose-glow-serum-1.jpg" — and this helper
 * turns it into a full URL at render time.
 *
 * HOW TO POINT THIS AT YOUR REAL BUCKET
 * Set NEXT_PUBLIC_R2_DOMAIN in your .env.local (see .env.local.example),
 * e.g.:
 *   NEXT_PUBLIC_R2_DOMAIN=pub-abcd1234.r2.dev
 * or, if you've mapped a custom domain to the bucket:
 *   NEXT_PUBLIC_R2_DOMAIN=images.pakessentials.com
 *
 * Then in data/products.js just reference the object's path inside the
 * bucket, e.g. "products/body-oils/marula-glow-1.jpg", and this file does
 * the rest. Don't forget to also allow that domain in next.config.js
 * (already wired up to read the same env var).
 */

const R2_DOMAIN = process.env.NEXT_PUBLIC_R2_DOMAIN || 'images.pakessentials.com';
console.log(process.env.NEXT_PUBLIC_R2_DOMAIN);

/**
 * Build a full https:// image URL from a short R2 object path.
 * @param {string} path - object path inside the bucket, e.g. "products/x.jpg"
 * @returns {string} full public URL
 */
export function r2Image(path) {
  if (!path) return `https://${R2_DOMAIN}/placeholder/product-placeholder.jpg`;
  // Allow passing an already-complete URL through untouched, in case you
  // ever want to link an image from somewhere else temporarily.
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.replace(/^\/+/, '');
  return `https://${R2_DOMAIN}/${cleanPath}`;
}
