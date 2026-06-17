/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 开发时代理 /api 的目标（默认 http://127.0.0.1:3000） */
  readonly VITE_DEV_PROXY_TARGET?: string
  /** 生产环境 API 根 URL（留空则使用相对路径 /api，需与前端同源反代） */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
