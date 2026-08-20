import Link from 'next/link';
import { categories } from '@/data/categories';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import Logo from './Logo';


// Developer credit link — opens a WhatsApp chat with the site's developer.
const DEVELOPER_WHATSAPP_URL = buildWhatsAppUrl(
  '2349039048518',
  "Hi, I found your work through the Pak Essentials site — I'd like to learn more about your services."
);
/**
 * components/Footer.js
 * ---------------------------------------------------------------------------
 * Static footer, rebuilt on a warm beige "surfacealt" panel instead of the
 * previous near-black bar — keeps the whole site light and consistent with
 * the Blume/Beauty Heroes reference direction, while still standing apart
 * visually from the plain page background. Automatically restyles for dark
 * mode since every color here is a semantic token.
 * Server component (no 'use client') — nothing here needs interactivity.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surfacealt/60 text-ink mt-24 border-t border-line/10">
      <div className="max-w-content mx-auto px-4 sm:px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <Logo sizeClassName="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28" className="mb-4" />
          <p className="font-display text-lg mb-2">Pak Essentials</p>
          <p className="text-sm text-muted max-w-xs">
            A curated storefront for authentic skincare and body-care brands — sourced with care, delivered with speed.
          </p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest2 text-gold-dark mb-4">Shop</p>
          <ul className="space-y-2 text-sm text-muted">
            {categories.slice(0, 4).map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-gold-dark transition-colors">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest2 text-gold-dark mb-4">More categories</p>
          <ul className="space-y-2 text-sm text-muted">
            {categories.slice(4).map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-gold-dark transition-colors">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/products" className="hover:text-gold-dark transition-colors">All products</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest2 text-gold-dark mb-4">Store</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/cart" className="hover:text-gold-dark transition-colors">Your bag</Link></li>
            <li><Link href="/checkout" className="hover:text-gold-dark transition-colors">Checkout</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line/10">
        <div className="max-w-content mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row flex-wrap items-center justify-center md:justify-between gap-3 md:gap-4 text-xs text-muted text-center md:text-left">
          <p>© {year} Pak Essentials. All rights reserved.</p>
          <p>Payments secured by Paystack .</p>
          <p>
            Built by{' '}
            
            <a href={DEVELOPER_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-dark underline underline-offset-2"
            >
              Norvar Technology Ltd
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
