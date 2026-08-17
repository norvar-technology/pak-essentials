import Image from 'next/image';
import { r2Image } from '@/lib/images';

/**
 * components/Logo.js
 * ---------------------------------------------------------------------------
 * Renders the Pak Essentials icon, preserving its real aspect ratio (no
 * stretching). Sizing works two ways:
 *   - Pass `height` for a single fixed pixel size everywhere (old behavior).
 *   - Pass `sizeClassName` with Tailwind width/height utilities (e.g.
 *     "w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24") for a size that scales
 *     across breakpoints — use this wherever the logo should look right on
 *     both mobile and desktop, like the footer.
 * If both are omitted, it falls back to a sensible default size.
 */
const ICON_PATH = 'products/pak-essentials-logo.png';

export default function Logo({ height, sizeClassName, className = '' }) {
  // Only apply the fixed inline pixel size when the caller didn't provide
  // responsive Tailwind classes — inline styles would otherwise override
  // the breakpoint classes and defeat the responsiveness.
  const style = sizeClassName ? undefined : { height: height || 48, width: height || 48 };
  const boxClasses = sizeClassName || '';

  return (
    <span
      className={`relative inline-block shrink-0 ${boxClasses} ${className}`}
      style={style}
    >
      <Image
        src={r2Image(ICON_PATH)}
        alt="Pak Essentials"
        fill
        sizes="120px"
        className="object-contain"
        priority
      />
    </span>
  );
}