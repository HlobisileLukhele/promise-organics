// Set all environment variables BEFORE any module imports so that
// config/env.js picks them up when the app is first imported in each test.
process.env.NODE_ENV = 'test'
process.env.PORT = '5001'
process.env.JWT_SECRET = 'test-secret-key-for-jest'
process.env.SUPABASE_URL = 'https://fake.supabase.co'
process.env.SUPABASE_SERVICE_KEY = 'fake-service-key-for-tests'
process.env.EMAIL_USER = 'test@promiseorganics.co.za'
process.env.EMAIL_PASS = 'testpassword123'
process.env.CONTACT_RECEIVER_EMAIL = 'admin@promiseorganics.co.za'
process.env.CLIENT_URL = '*'
process.env.BACKEND_URL = 'http://localhost:5001'
