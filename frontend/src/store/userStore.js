import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// In Docker, nginx proxies /api/* to the backend container.
// For local dev outside Docker, set VITE_API_URL=http://localhost:5000 in .env.local
const API = import.meta.env.VITE_API_URL || ''

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      register: async ({ firstName, lastName, email, password }) => {
        set({ isLoading: true })
        const url = `${API}/api/auth/register`
        const body = { full_name: `${firstName.trim()} ${lastName.trim()}`, email, password }
        console.log('[register] POST', url, body)
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
          const data = await res.json()
          console.log('[register] response', res.status, data)
          if (!res.ok) return { success: false, message: data.message || 'Registration failed.' }
          set({ user: data.user, token: data.token })
          return { success: true }
        } catch (err) {
          console.error('[register] network error', err)
          return { success: false, message: 'Network error. Please try again.' }
        } finally {
          set({ isLoading: false })
        }
      },

      login: async ({ email, password }) => {
        set({ isLoading: true })
        const url = `${API}/api/auth/login`
        console.log('[login] POST', url, { email })
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          const data = await res.json()
          console.log('[login] response', res.status, data)
          if (!res.ok) return { success: false, message: data.message || 'Login failed.' }
          set({ user: data.user, token: data.token })
          return { success: true }
        } catch (err) {
          console.error('[login] network error', err)
          return { success: false, message: 'Network error. Please try again.' }
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'promise-user',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)
