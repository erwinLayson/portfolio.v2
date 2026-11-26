import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import tailwindcss from "@tailwindcss/vite"

const PORTRAIT_WIDTHS = [480, 680, 960] as const
const PORTRAIT_SIZES = '(max-width: 767px) 360px, 620px'

function preloadPortraitPlugin(): Plugin {
  return {
    name: 'preload-lcp-portrait',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const candidates = ctx.bundle
          ? PORTRAIT_WIDTHS.map((width) => {
              const file = Object.keys(ctx.bundle!).find(
                (key) => key.includes(`me-${width}`) && key.endsWith('.avif'),
              )
              return file ? `/${file} ${width}w` : null
            }).filter((entry): entry is string => Boolean(entry))
          : PORTRAIT_WIDTHS.map(
              (width) => `/src/assets/portrait/me-${width}.avif ${width}w`,
            )

        if (candidates.length === 0) return html

        const preloadTag = `<link rel="preload" as="image" type="image/avif" imagesrcset="${candidates.join(', ')}" imagesizes="${PORTRAIT_SIZES}" fetchpriority="high" />`
        return html.replace('</head>', `    ${preloadTag}\n  </head>`)
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    preloadPortraitPlugin(),
  ],
})
