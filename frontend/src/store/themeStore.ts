import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark'

type ThemeState = {
  mode: ThemeMode
  setMode: (m: ThemeMode) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      setMode: (m) => set({ mode: m }),
    }),
    { name: 'gflowx-ui-theme' },
  ),
)
