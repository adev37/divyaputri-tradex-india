// server.js
import dotenv from 'dotenv';
import fs from 'fs';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Load .env.local first (dev), else .env (prod)
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
  console.log('📁 Loaded .env.local');
} else {
  dotenv.config();
  console.log('📁 Loaded .env');
}

// Routes
import aiRoutes from './routes/ai.js';
import contactRoutes from './routes/contact.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

/* ===== CORS ===== */
const allowedOrigins = [
  'https://divyaputritradex.com',
  'https://www.divyaputritradex.com',
  'https://divyaputri-tradex-india-m8zl.vercel.app',
  'https://divyaputri-tradex-india-2.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
].filter(Boolean);

// Deduplicate
const uniqueOrigins = [...new Set(allowedOrigins)];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (uniqueOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('❌ CORS blocked:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
  })
);

/* ===== SECURITY & PARSING ===== */
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

/* ===== GLOBAL RATE LIMIT ===== */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api', globalLimiter);

/* ===== MONGODB ===== */
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB error:', err.message));
} else {
  console.warn('⚠️  No MongoDB URI — running without DB');
}

/* ===== ROUTES ===== */
app.get('/', (req, res) => {
  res.json({
    message: 'Divyaputri Tradex Backend is running',
    status: 'OK',
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => res.send('OK'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    ai: process.env.GEMINI_API_KEY ? 'configured' : 'fallback',
  });
});

// API routes
app.use('/api/ai', aiRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Legacy support — purana route bhi kaam kare
app.use('/contact', contactRoutes);

/* ===== 404 ===== */
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/* ===== ERROR HANDLER ===== */
app.use(errorHandler);

/* ===== START ===== */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Allowed origins:`, uniqueOrigins);
  console.log(`🤖 Gemini AI: ${process.env.GEMINI_API_KEY ? 'Enabled' : 'Fallback mode'}`);
});