import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    // Cloudflare Quick Tunnel / 任意反向代理 Host，避免 trycloudflare.com 被默认拦截
    allowedHosts: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
    allowedHosts: true,
  },
})
