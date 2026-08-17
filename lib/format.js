/**
 * lib/format.js
 * ---------------------------------------------------------------------------
 * Small, dependency-free formatting helpers used across the site.
 */

/**
 * Format a number of kobo-free Naira (i.e. a plain number like 15500) into
 * "₦15,500". Kept in one place so every price on the site is consistent.
 */
export function formatNaira(amount) {
  if (typeof amount !== 'number') return '';
  return `₦${amount.toLocaleString('en-NG')}`;
}

/**
 * Paystack's API works in the smallest currency unit (kobo), so 1 Naira =
 * 100 kobo. This converts a Naira amount into the kobo integer Paystack
 * expects when we initialize a transaction.
 */
export function nairaToKobo(amount) {
  return Math.round(amount * 100);
}

/** Turn "Rose Glow Brightening Serum" into "rose-glow-brightening-serum" */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}
