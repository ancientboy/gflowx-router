import { apiClient, type ApiEnvelope } from './client'
import type { UserSelf } from './types'

export async function login(username: string, password: string): Promise<{ require2fa: boolean }> {
  const { data } = await apiClient.post<ApiEnvelope<{ require_2fa?: boolean }>>('/api/user/login', {
    username,
    password,
  })
  if (!data.success) {
    throw new Error(data.message || '登录失败')
  }
  if (data.data?.require_2fa) {
    return { require2fa: true }
  }
  return { require2fa: false }
}

export async function logout(): Promise<void> {
  await apiClient.get('/api/user/logout')
}

export async function fetchSelf(): Promise<UserSelf> {
  const { data } = await apiClient.get<ApiEnvelope<UserSelf>>('/api/user/self')
  if (!data.success || !data.data) {
    throw new Error(data.message || '未登录')
  }
  return data.data
}
