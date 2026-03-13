import request from 'supertest'
import app from '../app.js'

// Mock nodemailer — factory defines sendMail and exposes it on __sendMail for test access
jest.mock('nodemailer', () => {
  const sendMail = jest.fn().mockResolvedValue({ messageId: 'test-id' })
  const createTransport = jest.fn(() => ({ sendMail }))
  return {
    __esModule: true,
    default: { createTransport },
    createTransport,
    __sendMail: sendMail,
  }
})

// import * as gives us all module-level exports including __sendMail
import * as nodemailerMod from 'nodemailer'

beforeEach(() => {
  // clearAllMocks clears call history but NOT implementations
  // so the factory's mockResolvedValue({messageId:'test-id'}) remains active
  jest.clearAllMocks()
})

describe('POST /api/contact', () => {

  const validPayload = {
    name: 'Thato Mokoena',
    email: 'thato@test.com',
    phone: '0821234567',
    subject: 'Product enquiry',
    message: 'I would like to know more about your hair oil.',
  }

  test('returns 400 when name is missing', async () => {
    const { name, ...payload } = validPayload
    const res = await request(app).post('/api/contact').send(payload)
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/required/i)
  })

  test('returns 400 when email is missing', async () => {
    const { email, ...payload } = validPayload
    const res = await request(app).post('/api/contact').send(payload)
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  test('returns 400 when subject is missing', async () => {
    const { subject, ...payload } = validPayload
    const res = await request(app).post('/api/contact').send(payload)
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  test('returns 400 when message body is missing', async () => {
    const { message, ...payload } = validPayload
    const res = await request(app).post('/api/contact').send(payload)
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  test('returns 400 when required fields are whitespace only', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: '  ', email: '  ', subject: '  ', message: '  ' })
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  test('returns 200 and sends two emails on valid submission', async () => {
    const res = await request(app).post('/api/contact').send(validPayload)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.message).toMatch(/sent successfully/i)
    // sendMail called twice: business notification + customer auto-reply
    expect(nodemailerMod.__sendMail).toHaveBeenCalledTimes(2)
  })

  test('phone field is optional — succeeds without phone', async () => {
    const { phone, ...payload } = validPayload
    const res = await request(app).post('/api/contact').send(payload)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  test('returns 500 when nodemailer fails', async () => {
    nodemailerMod.__sendMail.mockRejectedValueOnce(new Error('SMTP connection failed'))

    const res = await request(app).post('/api/contact').send(validPayload)

    expect(res.status).toBe(500)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/failed to send/i)
  })

})
