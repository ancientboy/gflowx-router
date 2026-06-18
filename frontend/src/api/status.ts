import { apiClient, type ApiEnvelope } from './client'

/** 公开状态，无需登录 */
export async function fetchPublicStatus(): Promise<unknown> {
  const { data } = await apiClient.get<ApiEnvelope<unknown>>('/api/status')
  if (!data.success) {
    throw new Error(data.message || '状态接口失败')
  }
  return data.data
}
