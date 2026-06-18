import { apiClient, type ApiEnvelope } from './client'
import type { PageInfo, TokenRow } from './types'

export async function fetchTokens(page = 1, pageSize = 20): Promise<PageInfo<TokenRow>> {
  const { data } = await apiClient.get<ApiEnvelope<PageInfo<TokenRow>>>('/api/token/', {
    params: { p: page, page_size: pageSize },
  })
  if (!data.success || !data.data) {
    throw new Error(data.message || '加载令牌失败')
  }
  return data.data
}
