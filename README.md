# Chinito Scento website

Public site and order request portal. Separate from the internal system.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and fill in the Supabase URL and the **anon** key.
3. `npm run dev` to test, `npm run build` to check the production build.

## Deploy (Vercel)
New Vercel project from this repo. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under Environment Variables. Then connect your domain.

## Edit text
Brand text, steps, contact links and scent notes: `src/config.js`.
Colors: `tailwind.config.js`.

## Before going live
- Run `26_order_requests.sql`, then `27_affiliates.sql` in Supabase.
- Add `public/og.png` (1200x630) so shared links show an image.
- In the internal app, set `SITE_URL` in `Affiliates.jsx` to this site's address.
