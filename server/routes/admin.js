import express from "express";
import User from "../models/User.js";
import Contact from "../models/Contact.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth, requireAdmin);

router.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
    res.json(contacts);
  } catch { res.status(500).json({ error: "Could not fetch contacts." }); }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("name email isVerified createdAt").sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch { res.status(500).json({ error: "Could not fetch users." }); }
});

export default router;
