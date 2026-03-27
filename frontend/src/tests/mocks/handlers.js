import { http, HttpResponse } from 'msw'

const BASE_URL = 'http://localhost:5000'

// Returns a 401 response if no Authorization header is present
const unauthorized = () =>
  HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })

const isAuthed = (request) =>
  Boolean(request.headers.get('Authorization'))

export const handlers = [

  // Auth - Register
  http.post(`${BASE_URL}/api/auth/register`, () => {
    return HttpResponse.json({
      success: true,
      token: 'fake-jwt-token-123',
      user: { id: 'user-1', full_name: 'Test User',
              email: 'test@test.com', is_admin: false }
    })
  }),

  // Auth - Login
  http.post(`${BASE_URL}/api/auth/login`, async ({ request }) => {
    const body = await request.json()
    if (body.email === 'wrong@test.com') {
      return HttpResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }
    return HttpResponse.json({
      success: true,
      token: 'fake-jwt-token-123',
      user: { id: 'user-1', full_name: 'Test User',
              email: body.email, is_admin: false }
    })
  }),

  // Forgot Password
  http.post(`${BASE_URL}/api/auth/forgot-password`, () => {
    return HttpResponse.json({
      success: true,
      message: 'If that email exists, a reset link has been sent.'
    })
  }),

  // Reset Password
  http.post(`${BASE_URL}/api/auth/reset-password`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Password reset successfully.'
    })
  }),

  // Products — public endpoint
  http.get(`${BASE_URL}/api/products`, () => {
    return HttpResponse.json({
      success: true,
      products: [
        { id: 'prod-1', name: 'Avocado Hair Oil',
          price: 199, stock: 10, in_stock: true,
          image_url: '/test-image.jpg', description: 'Great oil' },
        { id: 'prod-2', name: 'Rosemary Shampoo',
          price: 149, stock: 0, in_stock: false,
          image_url: '/test-image.jpg', description: 'Great shampoo' }
      ]
    })
  }),

  // Cart — protected: requires Authorization header
  http.get(`${BASE_URL}/api/cart`, ({ request }) => {
    if (!isAuthed(request)) return unauthorized()
    return HttpResponse.json({
      success: true,
      cart: [
        { id: 'cart-1', product_id: 'prod-1', quantity: 2,
          product: { name: 'Avocado Hair Oil', price: 199 } }
      ]
    })
  }),

  http.post(`${BASE_URL}/api/cart`, ({ request }) => {
    if (!isAuthed(request)) return unauthorized()
    return HttpResponse.json({ success: true,
      message: 'Item added to cart' })
  }),

  http.delete(`${BASE_URL}/api/cart/:id`, ({ request }) => {
    if (!isAuthed(request)) return unauthorized()
    return HttpResponse.json({ success: true,
      message: 'Item removed from cart' })
  }),

  // Wishlist — protected: requires Authorization header
  http.get(`${BASE_URL}/api/wishlist`, ({ request }) => {
    if (!isAuthed(request)) return unauthorized()
    return HttpResponse.json({
      success: true,
      wishlist: [
        { id: 'wish-1', product_id: 'prod-1',
          product: { name: 'Avocado Hair Oil', price: 199 } }
      ]
    })
  }),

  http.post(`${BASE_URL}/api/wishlist`, ({ request }) => {
    if (!isAuthed(request)) return unauthorized()
    return HttpResponse.json({ success: true,
      message: 'Added to wishlist' })
  }),

  http.delete(`${BASE_URL}/api/wishlist/:id`, ({ request }) => {
    if (!isAuthed(request)) return unauthorized()
    return HttpResponse.json({ success: true,
      message: 'Removed from wishlist' })
  }),

  // Health check — public
  http.get(`${BASE_URL}/api/health`, () => {
    return HttpResponse.json({
      status: 'ok', db: 'connected', userCount: 1
    })
  }),

  // CSRF token — public; returns a predictable masked token for tests
  http.get(`${BASE_URL}/api/csrf-token`, () => {
    return HttpResponse.json({ success: true, csrfToken: 'test-csrf-token-masked' })
  }),
]
