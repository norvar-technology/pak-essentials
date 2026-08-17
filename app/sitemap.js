import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { SITE_URL } from '@/lib/seo';

/**
 * app/sitemap.js
 * ---------------------------------------------------------------------------
 * Next.js auto-generates /sitemap.xml from whatever this function returns.
 * Because it reads directly from data/products.js and data/categories.js,
 * the sitemap always stays accurate as you add/remove products — you never
 * have to hand-maintain a separate XML file.
 *
 * This is important for both classic SEO (Google/Bing discovery) and AI
 * crawlers, which frequently use the sitemap to find every indexable URL
 * on a site rather than only following on-page links.
 */
export default function sitemap() {
  const staticRoutes = ['', '/products', '/cart', '/checkout'].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : 0.6,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const productRoutes = products.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
