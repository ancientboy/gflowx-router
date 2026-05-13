import { create } from 'zustand'
import * as authApi from '../api/auth'
import type { UserSelf } from '../api/types'

type AuthState = {
  user: UserSelf | null
  loading: boolean
  /** 是否已完成首次会话探测（避免受保护路由闪跳登录页） */
  ready: boolean
  error: string | null
  refreshUser: () => Promise<void>
  login: (username: string, password: string) => Promise<{ require2fa: boolean }>
  logout: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  ready: false,
  error: null,

  clearError: () => set({ error: null }),

  refreshUser: async () => {
    set({ loading: true, error: null })
    try {
      const user = await authApi.fetchSelf()
      set({ user, loading: false, ready: true })
    } catch {
      set({ user: null, loading: false, ready: true })
    }
  },

  login: async (username, password) => {
    set({ loading: true, error: null })
    try {
      const r = await authApi.login(username, password)
      if (r.require2fa) {
        set({ loading: false, error: '当前账户开启了两步验证，请先在官方控制台完成登录流程。' })
        return r
      }
      const user = await authApi.fetchSelf()
      set({ user, loading: false, ready: true })
      return r
    } catch (e) {
      const msg = e instanceof Error ? e.message : '登录失败'
      set({ loading: false, error: msg })
      throw e
    }
  },

  logout: async () => {
    set({ loading: true, error: null })
    try {
      await authApi.logout()
    } finally {
      set({ user: null, loading: false, ready: true })
    }
  },
}))
