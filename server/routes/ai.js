import express from 'express';
import rateLimit from 'express-rate-limit';
import { chatWithAI } from '../controllers/aiController.js';

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many chat requests. Please try again later.' },
});

router.post('/chat', chatLimiter, chatWithAI);

export default router;