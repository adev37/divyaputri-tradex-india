import dotenv from 'dotenv';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load env in this module (imports run before server.js dotenv.config)
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

console.log(
  '🔑 aiClient init:',
  process.env.GEMINI_API_KEY ? 'Gemini ready' : 'No key — fallback only'
);

const SYSTEM_CONTEXT = `You are "Divya AI", the friendly assistant for Divyaputri Tradex LLP — a nano-technology company based in Mumbai, India.

COMPANY INFO:
- Name: Divyaputri Tradex LLP
- Industry: Nano-technology material science
- Industries: Electronics, Medical, Railway, Sports
- Location: Mumbai, Maharashtra, India
- Email: info@divyaputritradex.com
- Phone: +91 98765 43210
- Hours: Mon-Sat, 9 AM - 7 PM IST
- Precision: 10⁻⁹ meter (nano-scale)
- Quality: ISO 9001 & 13485 certified, 99.8% pass rate

PRODUCTS:
1. Nano Coated Circuit Boards (Electronics)
2. Antimicrobial Medical Devices (Medical)
3. Self-Lubricating Rail Components (Railway)
4. Performance Sports Gear (Sports)
5. Thermal Nano Pastes (Electronics)
6. Drug Delivery Nanoparticles (Medical)

GUIDELINES:
- Reply SHORT (2-4 sentences)
- Friendly, professional tone
- For quotes: suggest contact form or email
- If unsure, say so honestly
- Reply in user's language (English/Hindi/Hinglish)
- For casual messages (hi, how are you, thanks), reply naturally and warmly`;

export const generateChatReply = async (userMessage, history = []) => {
  if (!genAI) {
    console.log('⚠️  No Gemini API key — using fallback');
    return getFallbackReply(userMessage);
  }

  try {
const models = [
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-2.5-flash',
];

    let lastError = null;

    for (const modelName of models) {
      try {
        console.log(`🤖 Trying model: ${modelName}`);

        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_CONTEXT,
        });

        // Build history — must start with 'user' for Gemini
        let chatHistory = history
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .slice(-6)
          .map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          }));

        // Drop leading 'model' messages (Gemini requirement)
        while (chatHistory.length > 0 && chatHistory[0].role === 'model') {
          chatHistory.shift();
        }

        // Also ensure alternating roles (user, model, user, model...)
        const cleanedHistory = [];
        for (const msg of chatHistory) {
          const last = cleanedHistory[cleanedHistory.length - 1];
          if (last && last.role === msg.role) {
            // Same role twice — merge or skip (skip for simplicity)
            continue;
          }
          cleanedHistory.push(msg);
        }

        console.log(`📜 History length: ${cleanedHistory.length}`);

        const chat = model.startChat({ history: cleanedHistory });
        const result = await chat.sendMessage(userMessage);
        const reply = result.response.text().trim();

        console.log(`✅ Gemini replied via ${modelName}`);
        return reply;
      } catch (err) {
        console.warn(`❌ ${modelName} failed:`, err.message);
        lastError = err;
      }
    }

    console.error('❌ All models failed. Last:', lastError?.message);
    return getFallbackReply(userMessage);
  } catch (error) {
    console.error('❌ Gemini outer error:', error.message);
    return getFallbackReply(userMessage);
  }
};

function getFallbackReply(userMessage) {
  const msg = userMessage.toLowerCase();

  if (msg.includes('product') || msg.includes('offer'))
    return 'We offer nano-engineered products across 4 industries: Electronics, Medical, Railway, and Sports. Which one interests you?';

  if (msg.includes('industry') || msg.includes('industries'))
    return 'We serve 4 industries: Electronics, Medical, Railway, and Sports. Want details on any one?';

  if (msg.includes('quote') || msg.includes('price') || msg.includes('cost'))
    return 'For a custom quote, please fill out the contact form or email info@divyaputritradex.com. We reply within 24 hours.';

  if (msg.includes('contact') || msg.includes('email'))
    return 'Reach us at info@divyaputritradex.com or +91 98765 43210. Based in Mumbai.';

  if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey'))
    return "Hello! 👋 I'm Divya AI. Ask me about our products, industries, or how we can help.";

  return 'Great question! For detailed answers, email info@divyaputritradex.com or use the contact form. We respond within 24 hours.';
}