import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => set((state) => {
        const newDark = !state.isDark
        if (newDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        return { isDark: newDark }
      }),
      initTheme: () => {
        const stored = localStorage.getItem('theme-storage')
        const isDark = stored ? JSON.parse(stored)?.state?.isDark : false
        if (isDark) {
          document.documentElement.classList.add('dark')
        }
      }
    }),
    { name: 'theme-storage' }
  )
)

export default useThemeStore
