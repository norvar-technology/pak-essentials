'use client';

import { useState } from 'react';

/**
 * components/ShareButton.js
 * ---------------------------------------------------------------------------
 * A share button for product pages. On mobile (and supporting desktop
 * browsers), it opens the device's native share sheet via the Web Share
 * API — letting the user share straight to WhatsApp, Messages, email, etc.
 * On browsers without that API (most desktop browsers), it falls back to
 * copying the product link to the clipboard and shows a brief confirmation.
 *
 * `title` and `text` are passed in from the product page (product name and
 * short description) — the URL itself is read from the browser at click
 * time via window.location.href, so it's always the exact current page.
 */
export default function ShareButton({ title, text }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        // User closed the share sheet without picking anything — not an
        // error, nothing to do.
      }
      return;
    }

    // Fallback for browsers without the Web Share API: copy the link.
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Could not copy link:', err);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-gold-dark transition-colors"
    >
      <ShareIcon />
      {copied ? 'Link copied!' : 'Share'}
    </button>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" strokeLinecap="round" />
    </svg>
  );
}