import request from 'supertest'
import app from '../app.js'

// Define the mock INSIDE the factory — no TDZ issues
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

beforeEach(() => {
  jest.resetAllMocks()
  supabase.from.mockReturnValue(chain)
  chain.select.mockReturnThis()
  chain.insert.mockReturnThis()
  chain.update.mockReturnThis()
  chain.delete.mockReturnThis()
  chain.eq.mockReturnThis()
})

describe('GET /api/health', () => {

  test('returns 200 with status ok when database is reachable', async () => {
    // Default: select returns chain; await chain → chain object
    // count = undefined → 0 via ?? operator; error = undefined → no throw
    const res = await request(app).get('/api/health')

    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(res.body.db).toBe('connected')
    expect(typeof res.body.userCount).toBe('number')
    expect(res.body).toHaveProperty('timestamp')
  })

  test('returns 500 with db disconnected when supabase errors', async () => {
    // Override select() for this test to resolve to an error
    chain.select.mockResolvedValueOnce({
      count: null,
      error: { message: 'Connection refused' },
    })

    const res = await request(app).get('/api/health')

    expect(res.status).toBe(500)
    expect(res.body.status).toBe('error')
    expect(res.body.db).toBe('disconnected')
  })

})
