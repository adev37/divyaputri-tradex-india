import Contact from '../models/Contact.js';
import User from '../models/User.js';
import ChatLog from '../models/ChatLog.js';

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

/* ===== GET ALL USERS ===== */
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(100);
    res.json({ users });
  } catch (error) {
    next(error);
  }
};