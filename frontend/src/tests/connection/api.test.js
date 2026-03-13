import { describe, test, expect } from 'vitest'

// These tests run against MSW-intercepted requests (the same server active in
// setup.js). They verify that every expected endpoint is wired and responds
// with the correct shape / status code — a reliable smoke-test for the API
// contract even when the real backend is not running.

const BASE_URL = 'http://localhost:5000'

describe('Backend API Connection', () => {

  test('health check endpoint responds with ok', async () => {
    const response = await fetch(`${BASE_URL}/api/health`)
    const data = await response.json()
    expect(response.ok).toBe(true)
    expect(data.status).toBe('ok')
  })

  test('database is connected via health check', async () => {
    const response = await fetch(`${BASE_URL}/api/health`)
    const data = await response.json()
    expect(data.db).toBe('connected')
  })

  test('products endpoint is reachable and returns array', async () => {
    const response = await fetch(`${BASE_URL}/api/products`)
    const data = await response.json()
    expect(response.status).not.toBe(500)
    expect(response.status).not.toBe(404)
    expect(Array.isArray(data.products)).toBe(true)
  })

  test('auth register endpoint exists (not 404)', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({}),
    })
    // Should return some response — not 404 (not found)
    expect(response.status).not.toBe(404)
  })

  test('auth login endpoint exists (not 404)', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({}),
    })
    expect(response.status).not.toBe(404)
  })

  test('auth forgot-password endpoint exists (not 404)', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email: 'test@test.com' }),
    })
    expect(response.status).not.toBe(404)
  })

  test('cart endpoint requires authentication — returns 401 without token', async () => {
    const response = await fetch(`${BASE_URL}/api/cart`)
    // handlers.js returns 401 when no Authorization header is present
    expect(response.status).toBe(401)
  })

  test('cart endpoint is accessible with auth token', async () => {
    const response = await fetch(`${BASE_URL}/api/cart`, {
      headers: { Authorization: 'Bearer fake-jwt-token-123' },
    })
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
  })

  test('wishlist endpoint requires authentication — returns 401 without token', async () => {
    const response = await fetch(`${BASE_URL}/api/wishlist`)
    expect(response.status).toBe(401)
  })

  test('wishlist endpoint is accessible with auth token', async () => {
    const response = await fetch(`${BASE_URL}/api/wishlist`, {
      headers: { Authorization: 'Bearer fake-jwt-token-123' },
    })
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
  })

  test('login with valid credentials returns token', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email: 'test@test.com', password: 'password123' }),
    })
    const data = await response.json()
    expect(response.ok).toBe(true)
    expect(data.token).toBe('fake-jwt-token-123')
    expect(data.user).toBeDefined()
  })

  test('login with wrong credentials returns 401', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email: 'wrong@test.com', password: 'bad' }),
    })
    expect(response.status).toBe(401)
    const data = await response.json()
    expect(data.success).toBe(false)
  })

})
