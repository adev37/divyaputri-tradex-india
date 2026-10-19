import express from 'express';
import rateLimit from 'express-rate-limit';
import { chatWithAI, analyzeDocumentController, generateEmailController, analyzeMarketTrendController, generateQuoteController, recommendProductController } from '../controllers/aiController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Rate Limiters
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many requests. Please try again later.' },
});

const docLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many upload requests. Please try again later.' },
});

// Routes
router.post('/chat', chatLimiter, chatWithAI);
router.post('/analyze-document', docLimiter, upload.single('document'), analyzeDocumentController);
router.post('/generate-email', chatLimiter, generateEmailController);
router.post('/analyze-trends', chatLimiter, analyzeMarketTrendController);
router.post('/generate-quote', chatLimiter, generateQuoteController);
router.post('/recommend-product', docLimiter, upload.single('image'), recommendProductController);

export default router;