/**
 * components/RingBadge.js
 * ---------------------------------------------------------------------------
 * THE SIGNATURE ELEMENT of this design.
 *
 * Your logo is a gold ring wrapped around the "PE" monogram with a small
 * leaf breaking the circle. Instead of only using that as a static logo in
 * the header, this component reuses the open-ring shape as a recurring
 * motif across the site:
 *   - a slowly-rotating "authenticity seal" ring behind hero imagery
 *   - a divider between sections (in place of a generic <hr>)
 *   - the loading spinner during payment verification
 * This is what gives the site one consistent, memorable visual signature
 * instead of generic ecommerce chrome.
 *
 * Props:
 *   size    - pixel size (square), default 96
 *   spin    - if true, applies the slow ambient rotation animation
 *   className - extra classes (e.g. positioning) from the parent
 */
export default function RingBadge({ size = 96, spin = false, className = '' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      className={`${spin ? 'animate-ringSpin' : ''} ${className}`}
      aria-hidden="true"
    >
      {/* The main ring, left open where the leaf motif "breaks" it — mirrors
          the logo's open circle rather than a plain closed ring. */}
      <path
        d="M78 30 A38 38 0 1 0 78 70"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Small leaf, positioned where the ring breaks, echoing the logo. */}
      <path
        d="M78 66 C86 66 92 60 92 52 C84 52 78 58 78 66 Z"
        fill="currentColor"
      />
      <path
        d="M78 66 C78 58 84 52 92 52"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.6"
      />
    </svg>
  );
}
