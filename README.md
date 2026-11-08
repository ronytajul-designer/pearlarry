# Pearlarry · Storefront

Responsive jewellery e-commerce site built from the Pearlarry Figma file: home, shop, product detail, about, contact, cart, checkout, account (overview, orders, addresses, payment methods, wishlist, settings), sign in, register, forgot/reset password and 404.

**Stack:** Vite + React 19 · Framer Motion (interaction, in-view reveals, layout) · Lenis (smooth scroll) · GSAP ScrollTrigger (scroll-scrubbed parallax and text effects).

## Run locally

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

1. Push this folder to a GitHub repo (branch `main`).
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. Every push to `main` builds and deploys via `.github/workflows/deploy.yml`.

`vite.config.js` uses `base: '/pearlarry/'` (the repo name) so clean URLs like `/pearlarry/shop` work. The build copies `index.html` to `404.html` so deep links and refreshes load the app on GitHub Pages. If you move to a custom domain, change `base` to `'/'`.

## Structure

```
src/
  lib/smooth.jsx          Lenis + GSAP ticker sync, scrollTo helper
  components/motion.jsx   SplitText, Reveal, ParallaxImg, Magnetic
  components/Icon.jsx     Inline Tabler-style icons
  sections/*.jsx          Homepage sections + shared Navbar/Footer/CTA
  pages/*.jsx             Every other route
  components/ui.jsx       Form fields, page header, modal, accordion, etc.
  components/ProductCard  One card used by every product grid
  lib/store.jsx           Cart, promo, shipping method, auth, wishlist, orders, toasts (localStorage)
  products.js             24-product catalogue + per-product copy
  data.js                 Homepage copy, nav, footer links
public/img/               Optimised WebP images exported from Figma
```

## Before launch

- Cart, orders, account and forms are front-end only (state is saved in the browser). Connect a backend or Shopify before taking real orders.
- Promo code `WELCOME15` gives 15% off. Shipping: free over $50, else $4.95; Express $9.90.
- Blog, Careers, Terms and Privacy links land on the 404 page until those pages exist.
- Product FAQ answers 2 to 5 and catalogue items 13 to 24 are placeholder content.

- `data.js` → FAQ answers 2 to 5 are placeholder copy (only the first exists in Figma).
- `data.js` → `LOOKS`: the four styling tabs reuse the two comparison pairs from Figma. Add look-specific images.
- `Cta.jsx` → newsletter form is front-end only. Connect it to your email provider.
- Respects `prefers-reduced-motion` (Lenis, preloader and scrubbed effects switch off).
