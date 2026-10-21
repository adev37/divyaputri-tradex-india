import Contact from '../models/Contact.js';
import User from '../models/User.js';
import ChatLog from '../models/ChatLog.js';
import { generateAdminInsights, analyzeCompetitors } from '../utils/aiClient.js';

/* ===== DASHBOARD STATS ===== */
export const getStats = async (req, res, next) => {
  try {
    const [contacts, users, chats] = await Promise.all([
      Contact.countDocuments(),
      User.countDocuments(),
      ChatLog.countDocuments(),
    ]);

    res.json({ contacts, users, chats });
  } catch (error) {
    next(error);
  }
};

/* ===== GET ALL CONTACTS ===== */
export const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(100);
    res.json({ contacts });
  } catch (error) {
    next(error);
  }
};

/* ===== GET ALL USERS (Sirf Ek Baar) ===== */
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

/* ===== GET ALL CHATS (Naya) ===== */
export const getChats = async (req, res, next) => {
  try {
    const chats = await ChatLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ chats });
  } catch (error) {
    next(error);
  }
};

/* ===== AI INSIGHTS ===== */
export const getAIInsights = async (req, res, next) => {
  try {
    const [contacts, users, chats, latestContactsRaw] = await Promise.all([
      Contact.countDocuments(),
      User.countDocuments(),
      ChatLog.countDocuments(),
      Contact.find().sort({ createdAt: -1 }).limit(3),
    ]);

    const latestContacts = latestContactsRaw.map(c => `${c.name} (${c.email})`);

    const statsData = { contacts, users, chats, latestContacts };
    const insight = await generateAdminInsights(statsData);

    res.json({ success: true, insight });
  } catch (error) {
    next(error);
  }
};

/* ===== COMPETITOR ANALYSIS ===== */
export const getCompetitorAnalysis = async (req, res, next) => {
  try {
    const analysis = await analyzeCompetitors();
    res.json({ success: true, analysis });
  } catch (error) {
    next(error);
  }
};