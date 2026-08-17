/**
 * next.config.js
 * ---------------------------------------------------------------------------
 * Central configuration for the Pak Essentials storefront.
 *
 * WHY THIS FILE MATTERS TO YOU:
 * - `images.remotePatterns` tells Next.js which external domains it is
 *   allowed to optimise/serve images from. Because ALL your product photos
 *   live in Cloudflare R2 (not in this codebase), you MUST list your R2
 *   public domain here, otherwise <Image> will throw an error and refuse
 *   to render the picture.
 * - You can point this at either:
 *     a) the default R2 public bucket URL, e.g.
 *        https://pub-xxxxxxxxxxxx.r2.dev
 *     b) a custom domain you've mapped to the bucket, e.g.
 *        https://cdn.pakessentials.com
 *   Just add whichever one you actually use to the list below (or set it
 *   via the NEXT_PUBLIC_R2_DOMAIN environment variable so you don't have
 *   to edit code when it changes).
 */

const r2Domain = process.env.NEXT_PUBLIC_R2_DOMAIN
  ? process.env.NEXT_PUBLIC_R2_DOMAIN.replace(/^https?:\/\//, '')
  : null;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // Every domain product images are allowed to be loaded from.
    // Add more objects here if you ever serve images from a second source
    // (e.g. a CDN in front of R2).
    remotePatterns: [
      // Cloudflare R2's default public dev domain (*.r2.dev)
      {
        protocol: 'https',
        hostname: '**.r2.dev',
      },
      // Cloudflare R2 / Workers custom domains, and the raw
      // account-id.r2.cloudflarestorage.com domain, in case you use it.
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
      // Your own custom CDN domain, read from env so it's editable
      // without touching code. Falls back to a harmless placeholder
      // hostname when the env var isn't set (build never breaks).
      {
        protocol: 'https',
        hostname: r2Domain || 'images.pakessentials.com',
      },
    ],
  },

  // Nice, clean URLs: /products/rose-glow-serum instead of
  // /products/rose-glow-serum/index.html
  trailingSlash: false,
};

module.exports = nextConfig;
