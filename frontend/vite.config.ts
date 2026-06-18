import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const site = (env.VITE_SITE_URL || 'https://github.com/ancientboy/gflowx-router').replace(/\/$/, '')
  const ogImage = env.VITE_SITE_URL
    ? `${site}/og-image.svg`
    : 'https://raw.githubusercontent.com/ancientboy/gflowx-router/main/frontend/public/og-image.svg'

  return {
    plugins: [
      react(),
      {
        name: 'inject-og-placeholders',
        transformIndexHtml(html) {
          return html.replace(/__OG_IMAGE__/g, ogImage).replace(/__OG_URL__/g, site)
        },
      },
    ],
    server: {
      port: 5173,
      proxy: {
        '/api': { target: 'http://127.0.0.1:3000', changeOrigin: true },
        '/v1': { target: 'http://127.0.0.1:3000', changeOrigin: true },
      },
    },
  }
})
