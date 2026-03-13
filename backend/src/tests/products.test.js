import request from 'supertest'
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

const mockProducts = [
  { id: 'prod-1', name: 'Avocado Hair Oil', price: 199, stock: 50, image_url: '/oil.jpg', created_at: new Date().toISOString() },
  { id: 'prod-2', name: 'Rosemary Shampoo', price: 149, stock: 30, image_url: '/shampoo.jpg', created_at: new Date().toISOString() },
]

beforeEach(() => {
  jest.resetAllMocks()
  supabase.from.mockReturnValue(chain)
  chain.select.mockReturnThis()
  chain.insert.mockReturnThis()
  chain.update.mockReturnThis()
  chain.delete.mockReturnThis()
  chain.eq.mockReturnThis()
})

describe('GET /api/products', () => {

  test('returns 200 with an array of products', async () => {
    chain.order.mockResolvedValueOnce({ data: mockProducts, error: null })

    const res = await request(app).get('/api/products')

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data).toHaveLength(2)
  })

  test('returns 200 with empty array when no products exist', async () => {
    chain.order.mockResolvedValueOnce({ data: [], error: null })

    const res = await request(app).get('/api/products')

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(0)
  })

  test('product objects contain expected fields', async () => {
    chain.order.mockResolvedValueOnce({ data: mockProducts, error: null })

    const res = await request(app).get('/api/products')

    const product = res.body.data[0]
    expect(product).toHaveProperty('id')
    expect(product).toHaveProperty('name')
    expect(product).toHaveProperty('price')
  })

})

describe('GET /api/products/:id', () => {

  test('returns 200 with a single product when found', async () => {
    chain.single.mockResolvedValueOnce({ data: mockProducts[0], error: null })

    const res = await request(app).get('/api/products/prod-1')

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.id).toBe('prod-1')
    expect(res.body.data.name).toBe('Avocado Hair Oil')
  })

  test('returns 404 when product does not exist', async () => {
    chain.single.mockResolvedValueOnce({ data: null, error: { message: 'No rows found' } })

    const res = await request(app).get('/api/products/nonexistent-id')

    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/not found/i)
  })

})
