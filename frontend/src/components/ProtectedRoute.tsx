import type { ReactNode } from 'react'
import { Spin } from 'antd'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const loc = useLocation()
  const ready = useAuthStore((s) => s.ready)
  const user = useAuthStore((s) => s.user)

  if (!ready) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Spin />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  }

  return children
}
