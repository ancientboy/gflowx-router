import { useEffect } from 'react'

import { fetchSelf } from '../api/session'
import { useAuthStore } from '../store/authStore'

/** 启动时用 Cookie 会话探测是否已登录 new-api */
export default function AuthBootstrap() {
  const setUser = useAuthStore((s) => s.setUser)
  const setReady = useAuthStore((s) => s.setReady)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const r = await fetchSelf()
        if (cancelled) return
        if (r.success && r.data && typeof r.data.id === 'number') {
          setUser({
            id: r.data.id,
            username: String(r.data.username ?? ''),
            display_name: r.data.display_name as string | undefined,
            role: Number(r.data.role),
            status: Number(r.data.status),
            group: String(r.data.group ?? ''),
          })
        } else {
          setUser(null)
        }
      } catch {
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [setUser, setReady])

  return null
}
