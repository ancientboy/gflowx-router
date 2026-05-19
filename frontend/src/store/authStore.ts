import { create } from 'zustand'

import type { LoginUser } from '../api/session'

type AuthState = {
  user: LoginUser | null
  /** 是否已完成一次 /api/user/self 探测 */
  ready: boolean
  setUser: (u: LoginUser | null) => void
  setReady: (v: boolean) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  ready: false,
  setUser: (user) => set({ user }),
  setReady: (ready) => set({ ready }),
  clear: () => set({ user: null }),
}))
