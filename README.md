# Pak Essentials — Storefront

A frontend-only Next.js 14 (App Router) storefront for **Pak Essentials**, a
ghost store selling third-party skincare & beauty products. No backend
server or database — the product catalog is a plain JS file, the cart lives
in the browser, and the only server code is a single Vercel serverless
function that verifies Paystack payments.

---

## 1. What's inside

```
app/
  layout.js              Root layout: fonts, <CartProvider>, header/footer/WhatsApp widget
  page.js                Homepage
  products/page.js       All-products catalog page
  products/[slug]/page.js  Product detail page (SEO + JSON-LD + add to cart)
  category/[slug]/page.js  One page per category
  cart/page.js            Full-page cart view
  checkout/page.js        Delivery form + Paystack inline (bank transfer only)
  order-success/page.js   Verifies payment, hands off to WhatsApp
  api/verify-payment/route.js   The ONE server-side piece — a Vercel function
  sitemap.js, robots.js   Auto-generated SEO files

components/               All UI pieces (Header, Footer, ProductCard, cart
                           drawer, search overlay, WhatsApp widget, etc.)
context/CartContext.js    Client-side cart (localStorage), no backend
data/products.js          ⚠️ SAMPLE product catalog — replace with your real
                           inventory before going live
data/categories.js        The 11 category taxonomy — edit here to rename/add
lib/                       Small helpers: image URLs, currency formatting,
                           WhatsApp links, SEO metadata builders
```

Every file has detailed comments at the top explaining *why* it exists and
how it fits together — start there if anything is unclear.

---

## 2. Local setup

```bash
npm install
cp .env.local.example .env.local   # then fill in real values, see below
npm run dev                        # http://localhost:3000
```

## 3. Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

| Variable | What it's for |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your live domain — used for canonical URLs, OG tags, sitemap |
| `NEXT_PUBLIC_R2_DOMAIN` | Your Cloudflare R2 public/CDN domain, e.g. `pub-xxxx.r2.dev` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Vendor WhatsApp number, international format, digits only (e.g. `2348031234567`) |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack public key (`pk_...`) — safe in the browser |
| `PAYSTACK_SECRET_KEY` | Paystack secret key (`sk_...`) — **server-only**, used only in `app/api/verify-payment/route.js` |

When you deploy to Vercel, add the same variables under **Project Settings →
Environment Variables** (Vercel does not read your local `.env.local`).

---

## 4. Product images (Cloudflare R2)

Images are never stored in this repo — only their URLs. `lib/images.js`
turns a short path like `"products/face-serums/vitamin-c-serum-1.jpg"` into
a full `https://<your-r2-domain>/products/face-serums/vitamin-c-serum-1.jpg`
URL. Steps:

1. Upload your product photos to your R2 bucket, ideally mirroring the
   folder structure already used in `data/products.js` (e.g.
   `products/<category>/<slug>-1.jpg`) so it stays easy to scan.
2. Make sure the bucket (or a custom domain mapped to it) is publicly
   readable.
3. Set `NEXT_PUBLIC_R2_DOMAIN` to that domain.
4. `next.config.js` already whitelists `*.r2.dev` and
   `*.r2.cloudflarestorage.com` — if you use a fully custom domain instead,
   it's also read from the same env var automatically.

## 5. Replacing the sample catalog

`data/products.js` currently contains **placeholder** products/brands so
the site has something real to render and you can see the full design.
Before launch:

1. Replace each product object with your real inventory (keep the same
   field names — see the comment block at the top of the file).
2. Update `data/categories.js` only if you want to rename/add/remove a
   category — every nav menu, filter and sitemap entry updates
   automatically from that one file.

## 6. WhatsApp chat + order handoff

- The floating button (`components/WhatsAppWidget.js`) opens a small
  WhatsApp-styled composer. Whatever the shopper types is turned into a
  `wa.me` link and opened in a new tab — WhatsApp opens with your number's
  chat already active and the message pre-filled, ready for the shopper to
  hit send.
- After a successful, **verified** payment, `app/order-success/page.js`
  builds a similar `wa.me` link — this time pre-filled with the full order
  (items, quantities, total) — and auto-opens it after a few seconds (the
  shopper can also tap the button immediately).
- All of this logic lives in `lib/whatsapp.js`.

Set your number once via `NEXT_PUBLIC_WHATSAPP_NUMBER` and both flows use it.

## 7. Payments (Paystack, bank transfer only)

- `app/checkout/page.js` loads Paystack's **Inline** JS library directly
  from Paystack's CDN and opens their payment popup client-side — no
  "initialize transaction" server call needed.
- `channels: ['bank_transfer']` in the Paystack config restricts the popup
  to bank transfer only (no card, no USSD), per your requirement.
- Paystack's own popup confirms the transfer, but the browser callback is
  never trusted on its own. The customer is sent to `/order-success`, which
  calls `GET /api/verify-payment?reference=...` — a Vercel serverless
  function that re-checks the transaction directly with Paystack's server
  using your **secret** key. Only once that comes back successful do we show
  "Thank you" and build the WhatsApp order message.

### Testing payments
Use Paystack's test mode keys (`pk_test_...` / `sk_test_...`) and their
[test bank transfer details](https://paystack.com/docs/payments/test-payments/)
to run through the full flow before going live.

## 8. SEO & AI-crawler readiness

- Every product and category page gets a **unique** title, meta
  description, canonical URL, and Open Graph image (`lib/seo.js`).
- Every product page also emits schema.org `Product` JSON-LD
  (`components/ProductJsonLd.js`) with exact price, currency, brand and
  availability — the structured facts search engines and AI systems lift
  directly into results/answers.
- `app/sitemap.js` and `app/robots.js` are generated from your live product
  and category data, and `robots.js` explicitly allows common AI crawlers
  (GPTBot, ClaudeBot, PerplexityBot, etc.) alongside standard search bots.

## 9. Search

`components/SearchOverlay.js` filters the in-memory `data/products.js`
array on every keystroke — no API route, no network request, instant
results. Matches product name, brand, category, description and skin-concern
tags.

## 10. Deploying

This app is built for **Vercel** (the serverless function needs a host that
supports Next.js API routes — a fully static export won't work because of
`/api/verify-payment`).

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add the environment variables from section 3.
4. Deploy — Vercel builds the static pages and the one serverless function
   automatically.

---

## Questions while reading the code?

Every file starts with a comment block explaining what it does and why it's
built that way — that's the best place to start. Beyond that, the general
shape is: `data/` = your content, `lib/` = small pure-function helpers,
`context/` = shared client state (just the cart), `components/` = UI,
`app/` = pages & routes.
