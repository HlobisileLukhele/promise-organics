import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../app.js'

jest.mock('../config/supabase.js', () => {
  const chain = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn(),
    single: jest.fn(),
  }
  return { supabase: { from: jest.fn(() => chain), __chain: chain } }
})

import { supabase } from '../config/supabase.js'
const chain = supabase.__chain

const TEST_SECRET = 'test-secret-key-for-jest'
const authToken = jwt.sign({ id: 'user-uuid-123', email: 'test@test.com' }, TEST_SECRET, { expiresIn: '1h' })
const authHeader = { Authorization: `Bearer ${authToken}` }

const mockCartItems = [
  {
    id: 'ci-1',
    quantity: 2,
    product: { id: 'prod-1', name: 'Avocado Hair Oil', price: 199, stock: 50, image_url: '/oil.jpg' },
  },
]

const mockOrder = {
  id: 'order-uuid-1',
  user_id: 'user-uuid-123',
  total_amount: 398,
  status: 'pending',
  created_at: new Date().toISOString(),
}

beforeEach(() => {
  jest.resetAllMocks()
  supabase.from.mockReturnValue(chain)
  chain.select.mockReturnThis()
  chain.insert.mockReturnThis()
  chain.update.mockReturnThis()
  chain.delete.mockReturnThis()
  chain.eq.mockReturnThis()
})

describe('GET /api/orders', () => {

  test('returns 401 when no auth token is provided', async () => {
    const res = await request(app).get('/api/orders')
    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

  test('returns 200 with orders array when authenticated', async () => {
    chain.order.mockResolvedValueOnce({
      data: [{ id: 'order-uuid-1', total_amount: 398, status: 'pending', created_at: new Date().toISOString() }],
      error: null,
    })

    const res = await request(app).get('/api/orders').set(authHeader)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  test('returns empty array when user has no orders', async () => {
    chain.order.mockResolvedValueOnce({ data: [], error: null })

    const res = await request(app).get('/api/orders').set(authHeader)

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(0)
  })

})

describe('POST /api/orders', () => {

  test('returns 401 when no auth token is provided', async () => {
    const res = await request(app).post('/api/orders')
    expect(res.status).toBe(401)
  })

  test('returns 400 when cart is empty', async () => {
    // createOrder: first fetches cart → from().select().eq() terminal
    chain.eq.mockResolvedValueOnce({ data: [], error: null })

    const res = await request(app).post('/api/orders').set(authHeader)

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/cart is empty/i)
  })

  test('returns 201 with order data on successful checkout', async () => {
    // Step 1: fetch cart items (eq terminal)
    chain.eq.mockResolvedValueOnce({ data: mockCartItems, error: null })
    // Step 2: insert order (single terminal)
    chain.single.mockResolvedValueOnce({ data: mockOrder, error: null })
    // Step 3: insert order_items — insert().insert awaited → no error via default chain
    // Step 4: delete cart — delete().eq() terminal
    chain.eq.mockResolvedValueOnce({ error: null })

    const res = await request(app).post('/api/orders').set(authHeader)

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('order_id')
    expect(res.body.data.status).toBe('pending')
  })

})

describe('GET /api/orders/:id', () => {

  test('returns 401 when no auth token is provided', async () => {
    const res = await request(app).get('/api/orders/order-uuid-1')
    expect(res.status).toBe(401)
  })

  test('returns 404 when order does not exist', async () => {
    chain.single.mockResolvedValueOnce({ data: null, error: { message: 'No rows found' } })

    const res = await request(app)
      .get('/api/orders/nonexistent-id')
      .set(authHeader)

    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
  })

  test('returns 200 with order and items when found', async () => {
    const orderItems = [
      { id: 'oi-1', product_id: 'prod-1', quantity: 2, price: 199 },
    ]

    // query 1: .select().eq('id',...).eq('user_id',...).single()
    //   → eq calls 1 & 2 must return chain; then single() is terminal
    // query 2: .select().eq('order_id',...) → eq call 3 is terminal
    chain.eq
      .mockReturnValueOnce(chain)  // eq('id', ...) → chain
      .mockReturnValueOnce(chain)  // eq('user_id', ...) → chain (then single() resolves)
      .mockResolvedValueOnce({ data: orderItems, error: null })  // eq('order_id',...) terminal

    chain.single.mockResolvedValueOnce({ data: mockOrder, error: null })

    const res = await request(app)
      .get('/api/orders/order-uuid-1')
      .set(authHeader)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.id).toBe('order-uuid-1')
    expect(Array.isArray(res.body.data.items)).toBe(true)
  })

})
