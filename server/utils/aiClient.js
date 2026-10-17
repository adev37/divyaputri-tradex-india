import dotenv from 'dotenv';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load env
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
- Email: divyaputritradex@gmail.com
- Phone: +91 98765 43210
- Hours: Mon-Sat, 9 AM - 6 PM IST
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
- Reply in user's language (English/Hindi/Hinglish)`;

// ✅ CHAT FUNCTION
export const generateChatReply = async (userMessage, history = []) => {
  if (!genAI) return getFallbackReply(userMessage);

  try {
    const models = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
    let lastError = null;

    for (const modelName of models) {
      try {
        console.log(`🤖 Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName, systemInstruction: SYSTEM_CONTEXT });

        let chatHistory = history
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .slice(-6)
          .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));

        while (chatHistory.length > 0 && chatHistory[0].role === 'model') chatHistory.shift();

        const cleanedHistory = [];
        for (const msg of chatHistory) {
          const last = cleanedHistory[cleanedHistory.length - 1];
          if (last && last.role === msg.role) continue;
          cleanedHistory.push(msg);
        }

        const chat = model.startChat({ history: cleanedHistory });
        const result = await chat.sendMessage(userMessage);
        console.log(`✅ Gemini replied via ${modelName}`);
        return result.response.text().trim();
      } catch (err) {
        console.warn(`❌ ${modelName} failed:`, err.message);
        lastError = err;
      }
    }
    return getFallbackReply(userMessage);
  } catch (error) {
    console.error('❌ Gemini outer error:', error.message);
    return getFallbackReply(userMessage);
  }
};

// ✅ DOCUMENT ANALYSIS FUNCTION
export const analyzeDocument = async (fileBuffer, mimeType) => {
  if (!genAI) throw new Error('Gemini API is not configured.');

  const prompt = `You are a Senior Business Consultant at Divyaputri Tradex LLP (a Nano-technology company).
A client has uploaded a document. Do NOT just summarize the text. Instead, analyze it from a business perspective and provide a Strategic Analysis.

Your output must be structured exactly like this:

### 1. Document Overview
(1-2 sentences explaining what this document is about).

### 2. Business Opportunities (The "Why")
(Identify pain points, requirements, or materials mentioned in the document. Explain how Divyaputri Tradex can solve them using our Nano-technology).

### 3. Recommended Products
(Select specific products from our catalog that fit this document).

### 4. Next Steps for the Sales Team
(Give 1-2 actionable advice on how to pitch to this client).

Keep the tone highly professional, expert, and persuasive.`;

  const models = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-2.5-flash'];
  let lastError = null;

  for (const modelName of models) {
    try {
      console.log(`📄 Analyzing document with: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const filePart = { inlineData: { data: fileBuffer.toString('base64'), mimeType: mimeType } };
      const result = await model.generateContent([prompt, filePart]);
      console.log(`✅ Document analyzed via ${modelName}`);
      return result.response.text();
    } catch (err) {
      console.warn(`❌ Analysis failed for ${modelName}:`, err.message);
      lastError = err;
    }
  }
  throw new Error(lastError?.message || 'Failed to analyze document.');
};

// ✅ AI EMAIL GENERATOR FUNCTION (Naya)
export const generateProfessionalEmail = async (roughMessage) => {
  if (!genAI) throw new Error('Gemini API is not configured.');

  const prompt = `You are an expert business communication assistant for Divyaputri Tradex LLP.
A client has written this rough message: "${roughMessage}"

Your task is to rewrite this into a highly professional, polite, and clear B2B inquiry email. 
Do NOT include placeholders like [Name]. Just write the message body directly.
Keep it concise (max 3-4 sentences), professional, and ready to send.`;

  const models = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-2.5-flash'];
  let lastError = null;

  for (const modelName of models) {
    try {
      console.log(`✍️ Generating email with: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (err) {
      console.warn(`❌ Email gen failed for ${modelName}:`, err.message);
      lastError = err;
    }
  }
  throw new Error(lastError?.message || 'Failed to generate email.');
};

function getFallbackReply(userMessage) {
  const msg = userMessage.toLowerCase();
  if (msg.includes('product')) return 'We offer nano-engineered products across 4 industries: Electronics, Medical, Railway, and Sports. Which one interests you?';
  if (msg.includes('industry')) return 'We serve 4 industries: Electronics, Medical, Railway, and Sports. Want details on any one?';
  if (msg.includes('quote')) return 'For a custom quote, please fill out the contact form or email divyaputritradex@gmail.com. We reply within 24 hours.';
  return 'Great question! For detailed answers, email divyaputritradex@gmail.com or use the contact form. We respond within 24 hours.';
}

// ✅ MARKET TREND ANALYZER FUNCTION (Naya)
// MARKET TREND ANALYZER
export const analyzeMarketTrend = async (industry) => {
  if (!genAI) throw new Error('Gemini API is not configured.');

  const prompt = `You are a Senior Market Research Analyst at Divyaputri Tradex LLP (a Nano-technology company).
A user wants to know the current market trends and business opportunities in the "${industry}" industry specifically related to nano-technology.

Provide a detailed strategic report structured exactly like this:

### 1. Market Overview
(2-3 sentences on the current state of nano-tech in the ${industry} sector, global market size trends, and growth rate).

### 2. Top 3 Emerging Trends
(Identify the top 3 nano-technology trends currently disrupting the ${industry} sector. Explain briefly).

### 3. Opportunities for Divyaputri Tradex
(How can our specific products be positioned to capture this market?).

### 4. Strategic Advice for Clients
(What should a business in the ${industry} sector do right now to leverage nano-tech?).

Keep the tone highly professional, analytical, and data-driven. Use bullet points where necessary.`;

  const models = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-2.5-flash'];
  let lastError = null;

  for (const modelName of models) {
    try {
      console.log(`📊 Analyzing market trends for: ${industry} using ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (err) {
      console.warn(`❌ Trend analysis failed for ${modelName}:`, err.message);
      lastError = err;
    }
  }
  throw new Error(lastError?.message || 'Failed to analyze market trends.');
};

// ✅ ADMIN AI INSIGHTS FUNCTION (Naya)
export const generateAdminInsights = async (statsData) => {
  if (!genAI) throw new Error('Gemini API is not configured.');

const prompt = `You are an AI Business Analyst for Divyaputri Tradex LLP.
Here is the data from our website dashboard for today:
- Total Contacts: ${statsData.contacts}
- Total Registered Users: ${statsData.users}
- Total AI Chat Messages: ${statsData.chats}
- Latest Contacts (Names/Emails): ${statsData.latestContacts.join(', ')}

Provide a very short, punchy "Daily Business Insight" for the Admin (max 2-3 sentences).
IMPORTANT: Do NOT use any markdown formatting (no asterisks **, no hashes #). Just output plain text so it looks professional in the UI.
Be encouraging but professional. If there are no new contacts, tell them to focus on outreach.`;

  const models = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-2.5-flash'];
  let lastError = null;

  for (const modelName of models) {
    try {
      console.log(`🧠 Generating admin insights via ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (err) {
      console.warn(`❌ Admin insights failed for ${modelName}:`, err.message);
      lastError = err;
    }
  }
  throw new Error(lastError?.message || 'Failed to generate insights.');
};