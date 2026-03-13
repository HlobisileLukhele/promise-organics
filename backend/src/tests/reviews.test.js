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

const mockReviews = [
  { id: 'rev-1', name: 'Thato M.', rating: 5, message: 'Great product!', is_approved: true, created_at: new Date().toISOString() },
  { id: 'rev-2', name: 'Lerato K.', rating: 4, message: 'Love it!', is_approved: true, created_at: new Date().toISOString() },
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

describe('GET /api/reviews', () => {

  test('returns 200 with approved reviews array', async () => {
    // getReviews: select().eq().order() — order is terminal
    chain.order.mockResolvedValueOnce({ data: mockReviews, error: null })

    const res = await request(app).get('/api/reviews')

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.reviews)).toBe(true)
    expect(res.body.reviews).toHaveLength(2)
  })

  test('returns empty array when no approved reviews exist', async () => {
    chain.order.mockResolvedValueOnce({ data: [], error: null })

    const res = await request(app).get('/api/reviews')

    expect(res.status).toBe(200)
    expect(res.body.reviews).toHaveLength(0)
  })

})

describe('POST /api/reviews', () => {

  test('returns 400 when name is missing', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({ rating: 5, message: 'Great!' })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/name and message are required/i)
  })

  test('returns 400 when message is missing', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({ name: 'Thato', rating: 5 })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  test('returns 400 when name is whitespace only', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({ name: '   ', rating: 4, message: 'Good product.' })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  test('returns 400 when rating is out of range', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({ name: 'Thato', rating: 6, message: 'Nice!' })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/between 1 and 5/i)
  })

  test('returns 400 when rating is 0', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({ name: 'Thato', rating: 0, message: 'Nice!' })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  test('returns 400 when rating is not a number', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({ name: 'Thato', rating: 'five', message: 'Nice!' })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  test('returns 200 with success message on valid review submission', async () => {
    // submitReview: insert() → awaited; default insert returns chain, await chain → no error
    const res = await request(app)
      .post('/api/reviews')
      .send({ name: 'Thato Mokoena', rating: 5, message: 'Absolutely love this product!' })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.message).toMatch(/submitted/i)
  })

  test('review submission succeeds with optional product_id and user_id', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({
        name: 'Lerato K.',
        rating: 4,
        message: 'Very nourishing formula.',
        product_id: 'prod-1',
        user_id: 'user-uuid-123',
      })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

})
