# Teoriprøver — Danish Driving Theory Practice (MVP)

A standalone Next.js 14 site for Danish driving-theory practice, in English, with a
**50 DKK / 7-day** one-time access model via Stripe.

Original question bank (no third-party content) lives in `data/questions.json`.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in your OWN Stripe values (see below)
npm run dev
```

Open http://localhost:3000

Without Stripe keys the site still runs — the free 5-scenario preview works,
categories and pricing render. Only the "Buy" flow needs Stripe configured.

---

## What you set up yourself (I can't and shouldn't do these for you)

These involve your live payment credentials, so do them in your own Stripe
dashboard and paste the values into `.env.local`. Never share these keys.

1. **Create a Stripe account** at https://stripe.com
2. **Get your API keys**: Dashboard → Developers → API keys
   - `STRIPE_SECRET_KEY` (starts `sk_test_…` in test mode)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (starts `pk_test_…`)
3. **Create the product + price**: Products → Add product
   - One-time price, **50 DKK**
   - Copy the Price ID (`price_…`) → `STRIPE_PRICE_ID`
4. **Add a webhook**: Developers → Webhooks → Add endpoint
   - URL: `https://YOUR_DOMAIN/api/webhook`
   - Event: `checkout.session.completed`
   - Copy the signing secret (`whsec_…`) → `STRIPE_WEBHOOK_SECRET`
   - For local testing use the Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhook`

Test card in test mode: `4242 4242 4242 4242`, any future expiry, any CVC.

---

## How access works

No database in the MVP. Flow:

1. User clicks buy → `/api/checkout` creates a Stripe Checkout Session → redirect.
2. After paying, Stripe redirects to `/success?session_id=…`.
3. `/success` calls `/api/verify-access`, which asks Stripe if that session is
   **paid**. If yes, it sets a signed, httpOnly `access` cookie encoding an
   expiry 7 days out (`ACCESS_DURATION_DAYS`).
4. `/quiz` calls `/api/verify-access` (GET) to check the cookie and unlocks the
   full 25-question exam. Otherwise it serves a 5-scenario free preview.

The cookie is HMAC-signed with `STRIPE_WEBHOOK_SECRET`, so it can't be forged
client-side. When it expires, the user drops back to the free preview.

> Scaling later: swap the cookie for a DB row keyed to a customer/email if you
> want cross-device access, refunds handling, or purchase history. The webhook
> route is already the natural place to persist that.

---

## Project layout

```
app/
  page.tsx            Home: hero, categories, pricing
  quiz/page.tsx       Quiz engine (free preview vs full exam)
  success/page.tsx    Post-payment access grant
  api/checkout/       Creates Stripe Checkout session
  api/webhook/        Verifies Stripe events (audit/source of truth)
  api/verify-access/  GET: check cookie · POST: confirm session → set cookie
components/
  Chrome.tsx          Header + footer
  BuyButton.tsx       Client buy button
lib/
  access.ts           Sign/verify time-limited access tokens
  questions.ts        Bank loading + exam builder
data/
  questions.json      The original question bank
```

---

## Content notes (important)

- All questions are **original**, written from public Danish traffic rules
  (Færdselsloven) and the public teoriprøve format. No competitor content.
- The real teoriprøve is **image/video based**. This MVP is text-scenario based.
  To match the real test you'll want to add your **own or licensed** images per
  scenario (add an `image` field to each scenario and render it in the quiz).
  Do NOT use screenshots from other sites or Færdselsstyrelsen's actual images.
- Expand the bank by editing `data/questions.json` — same shape for every entry.

---

## Deploy

Vercel is the easiest for Next.js:
1. Push to a Git repo
2. Import in Vercel
3. Add the same env vars in Vercel → Project → Settings → Environment Variables
4. Update the Stripe webhook URL to your production domain
5. Switch Stripe from test to live keys when ready
