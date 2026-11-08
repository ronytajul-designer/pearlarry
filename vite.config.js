import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the site from /pearlarry/. Clean URLs (/shop, /product/x) need an
// absolute base, and a 404.html copy of the app so deep links and refreshes still load.
export default defineConfig({
  base: '/pearlarry/',
  plugins: [
    react(),
    {
      name: 'spa-404',
      closeBundle() {
        const dist = resolve(import.meta.dirname, 'dist')
        try { copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html')) } catch { /* dev */ }
      },
    },
  ],
})
