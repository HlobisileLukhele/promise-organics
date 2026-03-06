import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
  jwtSecret: process.env.JWT_SECRET,
  payfast: {
    merchantId:  process.env.PAYFAST_MERCHANT_ID,
    merchantKey: process.env.PAYFAST_MERCHANT_KEY,
    passphrase:  process.env.PAYFAST_PASSPHRASE,
    sandbox:     process.env.PAYFAST_SANDBOX !== 'false',
  },
  clientUrl:  process.env.CLIENT_URL  || 'http://localhost:5173',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:5000',
};
