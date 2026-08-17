import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/data/categories';
import { r2Image } from '@/lib/images';

/**
 * components/CategoryStrip.js
 * ---------------------------------------------------------------------------
 * "Shop by category" — every category as a clickable image tile, shown
 * once near the top of the homepage (right after the hero) so shoppers can
 * jump straight into any category at a glance.
 *
 * LAYOUT / RESPONSIVENESS
 * This is a plain CSS grid, not a horizontal-scroll strip, so there's
 * nothing that can overflow or distort on narrow screens:
 *   - 2 columns on phones
 *   - 3 columns on tablets (sm:)
 *   - 6 columns on desktop (lg:) — all 6 categories in one row
 * Each tile is a Link, so the whole image + label is tappable, not just
 * the text.
 */
export default function CategoryStrip() {
  return (
    <section className="max-w-content mx-auto px-4 sm:px-6 py-16">
      <div className="mb-6 sm:mb-8">
        <p className="text-[11px] uppercase tracking-widest2 text-gold-dark mb-2">Browse</p>
        <h2 className="font-display text-2xl sm:text-3xl">Shop by category</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
        {categories.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className="group block">
            <div className="relative aspect-square rounded-xl2 overflow-hidden bg-surfacealt">
              <Image
                src={r2Image(c.image)}
                alt={c.name}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Dark gradient at the bottom so the white label text stays
                  readable over any photo, without needing a separate text
                  block below the image (keeps tiles compact on mobile). */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-3 text-white text-sm font-medium leading-tight">
                {c.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}