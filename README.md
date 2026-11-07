# Pearlarry · Homepage

Responsive jewellery e-commerce homepage built from the Pearlarry Figma file.

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

`vite.config.js` uses `base: './'`, so it works on both `username.github.io` and `username.github.io/repo-name`.

## Structure

```
src/
  lib/smooth.jsx          Lenis + GSAP ticker sync, scrollTo helper
  components/motion.jsx   SplitText, Reveal, ParallaxImg, Magnetic
  components/Icon.jsx     Inline Tabler-style icons
  sections/*.jsx          One file per homepage section
  data.js                 All copy, products, FAQs, images
public/img/               Optimised WebP images exported from Figma
```

## Before launch

- `data.js` → FAQ answers 2 to 5 are placeholder copy (only the first exists in Figma).
- `data.js` → `LOOKS`: the four styling tabs reuse the two comparison pairs from Figma. Add look-specific images.
- `Cta.jsx` → newsletter form is front-end only. Connect it to your email provider.
- Respects `prefers-reduced-motion` (Lenis, preloader and scrubbed effects switch off).
