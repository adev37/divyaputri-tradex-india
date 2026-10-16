import { generateChatReply } from '../utils/aiClient.js';
import ChatLog from '../models/ChatLog.js';

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

    // Log to DB (non-blocking)
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