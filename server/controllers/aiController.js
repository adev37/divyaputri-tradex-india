import { generateChatReply, analyzeDocument, generateProfessionalEmail, analyzeMarketTrend, generateSmartQuote } from '../utils/aiClient.js';
import ChatLog from '../models/ChatLog.js';

// 1. Chat Controller
export const chatWithAI = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (message.length > 500) {
      return res.status(400).json({ error: 'Message too long (max 500 chars)' });
    }

    const reply = await generateChatReply(message.trim(), history);

    try {
      await ChatLog.create({
        userMessage: message.trim(),
        aiReply: reply,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });
    } catch (logErr) {
      console.warn('ChatLog save failed:', logErr.message);
    }

    res.json({ reply });
  } catch (error) {
    next(error);
  }
};

// 2. Document Analysis Controller
export const analyzeDocumentController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { buffer, mimetype } = req.file;
    const analysis = await analyzeDocument(buffer, mimetype);

    res.json({ success: true, analysis });
  } catch (error) {
    next(error);
  }
};

// 3. Email Generator Controller
export const generateEmailController = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length < 5) {
      return res.status(400).json({ error: 'Please write a rough message first.' });
    }

    const generatedEmail = await generateProfessionalEmail(message.trim());

    res.json({ success: true, email: generatedEmail });
  } catch (error) {
    next(error);
  }
};

// 4. Market Trend Controller
export const analyzeMarketTrendController = async (req, res, next) => {
  try {
    const { industry } = req.body;

    if (!industry) {
      return res.status(400).json({ error: 'Industry is required.' });
    }

    const analysis = await analyzeMarketTrend(industry);

    res.json({ success: true, analysis });
  } catch (error) {
    next(error);
  }
};

export const generateQuoteController = async (req, res, next) => {
  try {
    const { requirements } = req.body;
    if (!requirements || requirements.length < 10) {
      return res.status(400).json({ error: 'Please provide detailed requirements.' });
    }
    const quote = await generateSmartQuote(requirements);
    res.json({ success: true, quote });
  } catch (error) {
    next(error);
  }
};