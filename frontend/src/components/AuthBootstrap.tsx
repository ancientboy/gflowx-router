import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

/** 应用启动时探测 Cookie 会话 */
export default function AuthBootstrap() {
  const refreshUser = useAuthStore((s) => s.refreshUser)
  useEffect(() => {
    void refreshUser()
  }, [refreshUser])
  return null
}
