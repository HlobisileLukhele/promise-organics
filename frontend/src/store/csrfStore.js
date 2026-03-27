// CSRF store — holds the masked CSRF token in memory only (never localStorage/sessionStorage).
// The token is fetched from GET /api/csrf-token on app init and rotated after every login.
import { create } from 'zustand'

const API = import.meta.env.VITE_API_URL || ''

export const useCsrfStore = create((set, get) => ({
  // null until the first GET /api/csrf-token completes.
  csrfToken: null,

  /**
   * Fetch a fresh masked token from the server.
   *
   * The backend sets an httpOnly `csrftoken` cookie and returns a one-time
   * XOR-masked token in the response body. The cookie stays server-readable
   * only; the masked token is what we send in the X-CSRF-Token header.
   *
   * `credentials: 'include'` is required so the browser sends/accepts the
   * Set-Cookie header across dev origins (frontend :5173 → backend :5000).
   *
   * Returns the token string on success, or null if the request fails.
   */
  fetchToken: async () => {
    try {
      const res = await fetch(`${API}/api/csrf-token`, {
        credentials: 'include',
      })
      if (!res.ok) return null
      const data = await res.json()
      if (data.success && data.csrfToken) {
        set({ csrfToken: data.csrfToken })
        return data.csrfToken
      }
    } catch {
      // Silently fail — the middleware is bypassed in dev/test when the
      // cookie is absent, so the app still works without the token.
    }
    return null
  },

  /**
   * Clear the token on logout so a stale pre-login token is never reused.
   * The next login call will rotate the server-side secret and fetch a fresh token.
   */
  clearToken: () => set({ csrfToken: null }),

  /**
   * Synchronous read for use outside React component trees (Zustand actions, utils).
   * Equivalent to `useCsrfStore.getState().csrfToken` but callable from the store itself.
   */
  getToken: () => get().csrfToken,
}))
