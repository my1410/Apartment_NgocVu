import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import apartmentRoutes from './routes/apartmentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

export const app = express();
const cookieSecret = process.env.COOKIE_SECRET || process.env.JWT_SECRET || 'development-cookie-secret';

app.set('trust proxy', 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const configuredClientUrls = (process.env.CLIENT_URL || '')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...configuredClientUrls,
  'https://my1410.github.io',
  'https://my1410.github.io/Apartment_NgocVu',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    const isViteDevOrigin = /^http:\/\/(localhost|127\.0\.0\.1):517\d$/.test(origin || '');
    if (!origin || allowedOrigins.includes(origin) || isViteDevOrigin) return callback(null, true);
    return callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
  credentials: true
}));
app.use(express.json({ limit: '15kb' }));
app.use(express.urlencoded({ extended: true, limit: '15kb' }));
app.use(cookieParser(cookieSecret));
app.use(mongoSanitize());
app.use(hpp());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 250,
  standardHeaders: 'draft-7',
  legacyHeaders: false
}));

app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Da Nang Apartment API',
    health: '/health',
    docs: 'Set VITE_API_URL on the client to this backend URL + /api'
  });
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'real-estate-api',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/apartments', apartmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/contact', contactRoutes);

app.use(notFound);
app.use(errorHandler);
