import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_DEV_PROXY_TARGET || 'http://127.0.0.1:3000'

  const apiProxy = {
    '/api': {
      target: proxyTarget,
      changeOrigin: true,
      secure: false,
    },
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      allowedHosts: true,
      proxy: apiProxy,
    },
    preview: {
      port: 5173,
      strictPort: true,
      allowedHosts: true,
      proxy: apiProxy,
    },
  }
})
