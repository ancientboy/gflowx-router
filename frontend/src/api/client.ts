import axios, { type AxiosError } from 'axios'

/** 开发环境走 Vite 代理时留空；生产可设 `VITE_API_BASE_URL=https://你的网关` */
const baseURL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60_000,
})

export type ApiEnvelope<T> = {
  success: boolean
  message?: string
  data?: T
}

export function getApiErrorMessage(err: unknown): string {
  const ax = err as AxiosError<ApiEnvelope<unknown>>
  const msg = ax.response?.data?.message
  if (typeof msg === 'string' && msg) return msg
  if (ax.message) return ax.message
  return '请求失败'
}

apiClient.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ApiEnvelope<unknown>>) => {
    const msg = err.response?.data?.message
    if (msg) err.message = msg
    return Promise.reject(err)
  },
)
