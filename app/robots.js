import { SITE_URL } from '@/lib/seo';

/**
 * app/robots.js
 * ---------------------------------------------------------------------------
 * Generates /robots.txt. We deliberately allow everything (no disallowed
 * paths) since this is a public storefront with nothing to hide from
 * crawlers, and explicitly point crawlers to the sitemap. Listing common
 * AI crawler user-agents by name (rather than only relying on the wildcard
 * "*") makes the intent to be indexed/recommended by AI answer-engines
 * unambiguous — several of these bots respect a wildcard rule fine, but
 * being explicit avoids any future ambiguity if you ever need to tune
 * access per-bot.
 */
export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
