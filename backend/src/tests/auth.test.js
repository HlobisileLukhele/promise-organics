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
const single = chain.single

const TEST_SECRET = 'test-secret-key-for-jest'
const makeAuthToken = (payload = { id: 'user-uuid-123', email: 'test@test.com' }) =>
  jwt.sign(payload, TEST_SECRET, { expiresIn: '1h' })

beforeEach(() => {
  jest.resetAllMocks()
  supabase.from.mockReturnValue(chain)
  chain.select.mockReturnThis()
  chain.insert.mockReturnThis()
  chain.update.mockReturnThis()
  chain.delete.mockReturnThis()
  chain.eq.mockReturnThis()
})

describe('POST /api/auth/register', () => {

  test('returns 400 when required fields are missing', async () => {
    const res = await request(app).post('/api/auth/register').send({})
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/required/i)
  })

  test('returns 400 when password is too short', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ full_name: 'Test User', email: 'test@test.com', password: '1234567' })
    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/at least 8 characters/i)
  })

  test('returns 409 when email is already registered', async () => {
    chain.single.mockResolvedValueOnce({ data: { id: 'existing-id' }, error: null })

    const res = await request(app)
      .post('/api/auth/register')
      .send({ full_name: 'Test User', email: 'exists@test.com', password: 'password123' })

    expect(res.status).toBe(409)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/already registered/i)
  })

  test('returns 201 with token and user on successful registration', async () => {
    const newUser = {
      id: 'new-user-uuid',
      full_name: 'Test User',
      email: 'newuser@test.com',
      created_at: new Date().toISOString(),
    }

    // First single(): check existing → no user
    // Second single(): insert result → new user
    chain.single
      .mockResolvedValueOnce({ data: null, error: null })
      .mockResolvedValueOnce({ data: newUser, error: null })

    const res = await request(app)
      .post('/api/auth/register')
      .send({ full_name: 'Test User', email: 'newuser@test.com', password: 'password123' })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(typeof res.body.token).toBe('string')
    expect(res.body.user.email).toBe('newuser@test.com')
  })

})

describe('POST /api/auth/login', () => {

  test('returns 400 when fields are missing', async () => {
    const res = await request(app).post('/api/auth/login').send({})
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  test('returns 401 when user is not found', async () => {
    chain.single.mockResolvedValueOnce({ data: null, error: { message: 'No rows found' } })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'unknown@test.com', password: 'password123' })

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/invalid email or password/i)
  })

  test('returns 401 when password does not match', async () => {
    // A real bcrypt hash for the string 'correctpassword' (cost 10 for test speed)
    const { hash } = await import('bcryptjs')
    const password_hash = await hash('correctpassword', 10)

    chain.single.mockResolvedValueOnce({
      data: {
        id: 'user-id',
        full_name: 'Test User',
        email: 'test@test.com',
        role: 'customer',
        password_hash,
        created_at: new Date().toISOString(),
      },
      error: null,
    })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'wrongpassword' })

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

})

describe('GET /api/auth/me', () => {

  test('returns 401 when no token is provided', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

  test('returns 401 when token is invalid', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid.token.here')
    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

  test('returns 200 with user when token is valid', async () => {
    const user = {
      id: 'user-uuid-123',
      full_name: 'Test User',
      email: 'test@test.com',
      created_at: new Date().toISOString(),
    }
    chain.single.mockResolvedValueOnce({ data: user, error: null })

    const token = makeAuthToken({ id: 'user-uuid-123', email: 'test@test.com' })
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.user.email).toBe('test@test.com')
  })

})
