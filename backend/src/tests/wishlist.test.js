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

const mockWishlistItem = {
  id: 'wish-1',
  product: { id: 'prod-1', name: 'Avocado Hair Oil', price: 199 },
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

describe('GET /api/wishlist', () => {

  test('returns 401 when no auth token is provided', async () => {
    const res = await request(app).get('/api/wishlist')
    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

  test('returns 200 with wishlist data when authenticated', async () => {
    chain.eq.mockResolvedValueOnce({ data: [mockWishlistItem], error: null })

    const res = await request(app).get('/api/wishlist').set(authHeader)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

})

describe('POST /api/wishlist', () => {

  test('returns 401 when no auth token is provided', async () => {
    const res = await request(app).post('/api/wishlist').send({ product_id: 'prod-1' })
    expect(res.status).toBe(401)
  })

  test('returns 400 when product_id is missing', async () => {
    const res = await request(app).post('/api/wishlist').set(authHeader).send({})
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/product_id is required/i)
  })

  test('returns 200 when product is already in wishlist', async () => {
    const existing = { id: 'wish-1', product_id: 'prod-1' }
    chain.single.mockResolvedValueOnce({ data: existing, error: null })

    const res = await request(app)
      .post('/api/wishlist')
      .set(authHeader)
      .send({ product_id: 'prod-1' })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.message).toMatch(/already in wishlist/i)
  })

  test('returns 201 when product is added to wishlist', async () => {
    const newItem = { id: 'wish-new', product_id: 'prod-2' }

    // First single(): check existing → null
    // Second single(): insert result → new item
    chain.single
      .mockResolvedValueOnce({ data: null, error: null })
      .mockResolvedValueOnce({ data: newItem, error: null })

    const res = await request(app)
      .post('/api/wishlist')
      .set(authHeader)
      .send({ product_id: 'prod-2' })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.product_id).toBe('prod-2')
  })

})

describe('DELETE /api/wishlist/:id', () => {

  test('returns 401 when no auth token is provided', async () => {
    const res = await request(app).delete('/api/wishlist/wish-1')
    expect(res.status).toBe(401)
  })

  test('returns 200 with success message when item is removed', async () => {
    chain.eq
      .mockReturnValueOnce(chain)
      .mockResolvedValueOnce({ error: null, count: 1 })

    const res = await request(app)
      .delete('/api/wishlist/wish-1')
      .set(authHeader)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.message).toMatch(/removed/i)
  })

  test('returns 404 when item does not exist', async () => {
    chain.eq
      .mockReturnValueOnce(chain)
      .mockResolvedValueOnce({ error: null, count: 0 })

    const res = await request(app)
      .delete('/api/wishlist/nonexistent-id')
      .set(authHeader)

    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
  })

})
