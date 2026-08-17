import Link from 'next/link';
import Image from 'next/image';
import { r2Image } from '@/lib/images';
import RingBadge from './RingBadge';

/**
 * components/Hero.js
 * ---------------------------------------------------------------------------
 * The homepage's opening statement — redesigned to match the light,
 * editorial reference sites (Blume, Beauty Heroes): a warm beige/off-white
 * background, a bold serif headline on the left, a sage-to-gold gradient
 * CTA button (echoing Blume's gradient "Shop Now" button), and a product
 * photo on the right with the signature rotating gold ring behind it — a
 * direct callback to the logo.
 *
 * Replace the `heroImage` path with a real lifestyle/product photo from
 * your R2 bucket once you have one — e.g. "branding/hero-1.jpg".
 */
export default function Hero() {
  const heroImage = r2Image('products/heroimage.png');

  return (
    <section className="bg-surfacealt/40">
      <div className="max-w-content mx-auto px-4 sm:px-6 grid lg:grid-cols-2 items-center gap-10 lg:gap-4 py-14 lg:py-20">
        {/* Copy */}
        <div className="order-2 lg:order-1">
          <p className="text-[11px] uppercase tracking-widest2 text-gold-dark mb-5">
            Curated skincare &amp; wellness
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] mb-6 max-w-lg text-ink">
            Considered essentials, for skin that shows up every day.
          </h1>
          <p className="text-muted max-w-md mb-9 leading-relaxed">
            Pak Essentials sources genuine, curated skincare, body-care
            and wellness brands — face creams to body oils, toners to
            supplements — and gets them to your door, no guesswork required.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center px-7 py-3.5 rounded-full uppercase tracking-widest2 text-[13px] text-white shadow-card hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #96A887 0%, #B99657 100%)' }}
            >
              Shop all products
            </Link>
            <Link
              href="/category/face-creams"
              className="inline-flex items-center border border-ink/20 px-7 py-3.5 rounded-full uppercase tracking-widest2 text-[13px] hover:border-gold-dark hover:text-gold-dark transition-colors"
            >
              Explore face creams
            </Link>
          </div>
        </div>

        {/* Image + signature ring motif */}
        <div className="order-1 lg:order-2 relative">
          <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] w-full max-w-md mx-auto">
            {/* Rotating ring sits behind the photo, peeking out at the edges */}
            <RingBadge
              size={420}
              spin
              className="absolute -top-10 -right-10 text-gold/25 hidden sm:block pointer-events-none"
            />
            <div className="relative w-full h-full rounded-xl2 overflow-hidden shadow-card">
              <Image
                src={heroImage}
                alt="Pak Essentials curated skincare edit"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 480px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
