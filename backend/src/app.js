import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { config } from './config/env.js';
import { csrfProtect } from './middleware/csrf.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

// Security headers
app.use(helmet());

// CORS — allow all configured frontend origins (comma-separated CLIENT_URL, or * for Docker)
const allowedOrigins = config.clientUrl.split(',').map((o) => o.trim());
const allowAllOrigins = allowedOrigins.includes('*');
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    // Allow all when CLIENT_URL=* (Docker/nginx deployments)
    if (!origin || allowAllOrigins || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

// JSON body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(csrfProtect);

// Global rate limiter: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use(limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts. Please try again later.' },
});
app.use('/api/auth', authLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Promise Organics API is running.', env: config.nodeEnv });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
});

// Global error handler
app.use(errorHandler);

export default app;
