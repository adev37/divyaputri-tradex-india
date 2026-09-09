import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, company, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email and message are all required." });
    }

    const contact = await Contact.create({ name, email, company, message });
    return res.status(201).json({ success: true, data: contact });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// GET /api/contact
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.json(contacts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not fetch contacts." });
  }
});

export default router;
