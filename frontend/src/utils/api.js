// Central fetch wrapper — adds X-CSRF-Token to every mutating request and handles CSRF failures.
import { useCsrfStore } from '@/store/csrfStore'

/** HTTP methods that mutate state and require a CSRF token. */
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

/**
 * Drop-in replacement for `fetch()` that transparently handles CSRF protection.
 *
 * What it does:
 *   1. Passes GET / HEAD requests through unchanged — no CSRF header needed.
 *   2. For POST / PUT / PATCH / DELETE:
 *      a. Reads the current token from csrfStore (in-memory, never persisted).
 *      b. If no token is stored yet (e.g. still loading on init), calls
 *         fetchToken() first and awaits the result — the request is held
 *         until the token is available, never silently dropped.
 *      c. Adds `X-CSRF-Token: <token>` to the request headers.
 *      d. Adds `credentials: 'include'` so the httpOnly csrftoken cookie is
 *         sent alongside the request (required for backend validation).
 *   3. On HTTP 403 with a CSRF-related error message:
 *      a. Fetches a fresh token from GET /api/csrf-token.
 *      b. Retries the original request exactly once.
 *      c. If the retry also returns 403, throws a user-friendly Error instead
 *         of leaking the raw backend message to the UI.
 *
 * Non-CSRF 403 responses (e.g. "Forbidden. Admin access required.") are
 * returned as-is — only responses whose `message` contains the word "csrf"
 * (case-insensitive) trigger the retry logic.
 *
 * @param {string}       url
 * @param {RequestInit} [options]
 * @returns {Promise<Response>}
 */
export async function apiFetch(url, options = {}) {
  const method      = (options.method || 'GET').toUpperCase()
  const isMutating  = MUTATING_METHODS.has(method)

  // Build the final RequestInit, injecting the CSRF header when appropriate.
  const buildOptions = (token) => ({
    ...options,
    method,
    // Always include credentials so the httpOnly cookie travels with the request.
    // In same-origin production (Docker nginx) this is the default; here we make
    // it explicit so cross-origin dev (Vite :5173 → Express :5000) also works.
    credentials: 'include',
    headers: {
      ...(options.headers || {}),
      // Only add the header on mutating requests — GETs don't need it.
      ...(isMutating && token ? { 'X-CSRF-Token': token } : {}),
    },
  })

  // Ensure a token is available before sending any mutating request.
  let token = useCsrfStore.getState().csrfToken
  if (isMutating && !token) {
    // fetchToken() sets the store and returns the token (or null on failure).
    token = await useCsrfStore.getState().fetchToken()
  }

  const response = await fetch(url, buildOptions(token))

  // ── CSRF failure recovery ────────────────────────────────────────────────
  if (response.status === 403 && isMutating) {
    let body = null
    try {
      // Clone before reading — the original response body may only be read once.
      body = await response.clone().json()
    } catch {
      // Body is not JSON or already consumed — not a CSRF error.
    }

    const isCsrfError =
      typeof body?.message === 'string' &&
      body.message.toLowerCase().includes('csrf')

    if (isCsrfError) {
      // Rotate the token by fetching a fresh one, then retry once.
      const freshToken    = await useCsrfStore.getState().fetchToken()
      const retryResponse = await fetch(url, buildOptions(freshToken))

      if (retryResponse.status === 403) {
        // Retry failed too — surface a safe, generic message.
        throw new Error('Your session has expired. Please refresh the page and try again.')
      }

      return retryResponse
    }
  }

  return response
}
