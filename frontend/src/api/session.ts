const apiPrefix = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

function apiUrl(path: string): string {
  if (path.startsWith('http')) return path
  return `${apiPrefix}${path.startsWith('/') ? path : `/${path}`}`
}

export type LoginUser = {
  id: number
  username: string
  display_name?: string
  role: number
  status: number
  group: string
}

export type ApiEnvelope<T> = {
  success: boolean
  message?: string
  data?: T
}

export async function login(username: string, password: string): Promise<ApiEnvelope<LoginUser & { require_2fa?: boolean }>> {
  const res = await fetch(apiUrl('/api/user/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  })
  const json = (await res.json()) as ApiEnvelope<LoginUser & { require_2fa?: boolean }>
  return json
}

export async function fetchSelf(): Promise<ApiEnvelope<LoginUser & Record<string, unknown>>> {
  const res = await fetch(apiUrl('/api/user/self'), {
    method: 'GET',
    credentials: 'include',
  })
  const json = (await res.json()) as ApiEnvelope<LoginUser & Record<string, unknown>>
  return json
}

export async function logout(): Promise<void> {
  await fetch(apiUrl('/api/user/logout'), { method: 'GET', credentials: 'include' })
}
