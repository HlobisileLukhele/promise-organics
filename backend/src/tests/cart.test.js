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

const mockCartItem = {
  id: 'cart-item-1',
  quantity: 2,
  product: { id: 'prod-1', name: 'Avocado Hair Oil', price: 199, stock: 50, image_url: '/oil.jpg' },
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

describe('GET /api/cart', () => {

  test('returns 401 when no auth token is provided', async () => {
    const res = await request(app).get('/api/cart')
    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

  test('returns 200 with cart data when authenticated', async () => {
    // getCart: select().eq() — last eq() is terminal
    chain.eq.mockResolvedValueOnce({ data: [mockCartItem], error: null })

    const res = await request(app).get('/api/cart').set(authHeader)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

})

describe('POST /api/cart', () => {

  test('returns 401 when no auth token is provided', async () => {
    const res = await request(app).post('/api/cart').send({ product_id: 'prod-1' })
    expect(res.status).toBe(401)
  })

  test('returns 400 when product_id is missing', async () => {
    const res = await request(app).post('/api/cart').set(authHeader).send({})
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/product_id is required/i)
  })

  test('returns 400 when quantity is less than 1', async () => {
    const res = await request(app)
      .post('/api/cart')
      .set(authHeader)
      .send({ product_id: 'prod-1', quantity: 0 })
    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/quantity must be at least 1/i)
  })

  test('returns 201 when adding a new item to cart', async () => {
    const newCartItem = { id: 'cart-item-new', quantity: 1, product_id: 'prod-1' }

    // First single(): check existing → null (new item)
    // Second single(): insert result → new item
    chain.single
      .mockResolvedValueOnce({ data: null, error: null })
      .mockResolvedValueOnce({ data: newCartItem, error: null })

    const res = await request(app)
      .post('/api/cart')
      .set(authHeader)
      .send({ product_id: 'prod-1', quantity: 1 })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.product_id).toBe('prod-1')
  })

  test('returns 201 when updating quantity of existing cart item', async () => {
    const existing = { id: 'cart-item-1', quantity: 2 }
    const updated = { id: 'cart-item-1', quantity: 3, product_id: 'prod-1' }

    // First single(): check existing → found
    // Second single(): update result
    chain.single
      .mockResolvedValueOnce({ data: existing, error: null })
      .mockResolvedValueOnce({ data: updated, error: null })

    const res = await request(app)
      .post('/api/cart')
      .set(authHeader)
      .send({ product_id: 'prod-1', quantity: 1 })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
  })

})

describe('PATCH /api/cart/:id', () => {

  test('returns 401 when no auth token is provided', async () => {
    const res = await request(app).patch('/api/cart/cart-item-1').send({ quantity: 3 })
    expect(res.status).toBe(401)
  })

  test('returns 400 when quantity is missing', async () => {
    const res = await request(app)
      .patch('/api/cart/cart-item-1')
      .set(authHeader)
      .send({})
    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/quantity is required/i)
  })

  test('returns 400 when quantity is less than 1', async () => {
    const res = await request(app)
      .patch('/api/cart/cart-item-1')
      .set(authHeader)
      .send({ quantity: 0 })
    expect(res.status).toBe(400)
  })

  test('returns 200 with updated item on success', async () => {
    const updatedItem = { id: 'cart-item-1', quantity: 5, product_id: 'prod-1' }
    chain.single.mockResolvedValueOnce({ data: updatedItem, error: null })

    const res = await request(app)
      .patch('/api/cart/cart-item-1')
      .set(authHeader)
      .send({ quantity: 5 })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.quantity).toBe(5)
  })

  test('returns 404 when cart item does not exist', async () => {
    chain.single.mockResolvedValueOnce({ data: null, error: null })

    const res = await request(app)
      .patch('/api/cart/nonexistent-id')
      .set(authHeader)
      .send({ quantity: 2 })

    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
  })

})

describe('DELETE /api/cart/:id', () => {

  test('returns 401 when no auth token is provided', async () => {
    const res = await request(app).delete('/api/cart/cart-item-1')
    expect(res.status).toBe(401)
  })

  test('returns 200 with success message when item is removed', async () => {
    // delete().eq().eq() — configure eq chain:
    // first eq → chain, second eq → Promise with count=1
    chain.eq
      .mockReturnValueOnce(chain)
      .mockResolvedValueOnce({ error: null, count: 1 })

    const res = await request(app)
      .delete('/api/cart/cart-item-1')
      .set(authHeader)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.message).toMatch(/removed/i)
  })

  test('returns 404 when cart item does not exist', async () => {
    chain.eq
      .mockReturnValueOnce(chain)
      .mockResolvedValueOnce({ error: null, count: 0 })

    const res = await request(app)
      .delete('/api/cart/nonexistent-id')
      .set(authHeader)

    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
  })

})
