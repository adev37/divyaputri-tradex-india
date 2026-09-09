import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendVerificationEmail } from "../utils/mailer.js";

const router = express.Router();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const codeHash = (code) => crypto.createHash("sha256").update(code).digest("hex");
const createToken = (user) => jwt.sign({ id: user._id.toString(), role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!name || !emailRegex.test(normalizedEmail) || !password || password.length < 8) {
      return res.status(400).json({ error: "Name, valid email and password of at least 8 characters are required." });
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing?.isVerified) return res.status(409).json({ error: "This email is already registered. Please sign in." });

    const passwordHash = await bcrypt.hash(password, 12);
    const code = String(crypto.randomInt(100000, 1000000));
    const update = { name: name.trim(), email: normalizedEmail, password: passwordHash, role: "user", isVerified: false, verificationCodeHash: codeHash(code), verificationExpires: new Date(Date.now() + 10 * 60 * 1000) };
    await User.findOneAndUpdate({ email: normalizedEmail }, update, { upsert: true, new: true, setDefaultsOnInsert: true });
    await sendVerificationEmail(normalizedEmail, code);
    res.status(201).json({ success: true, message: "Verification code sent to your email.", email: normalizedEmail });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create account or send verification email." });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const code = String(req.body.code || "").trim();
    const user = await User.findOne({ email });
    if (!user || !user.verificationCodeHash || !user.verificationExpires) return res.status(400).json({ error: "Verification request not found." });
    if (user.verificationExpires < new Date() || user.verificationCodeHash !== codeHash(code)) return res.status(400).json({ error: "Invalid or expired verification code." });
    user.isVerified = true;
    user.verificationCodeHash = undefined;
    user.verificationExpires = undefined;
    await user.save();
    res.json({ success: true, message: "Email verified. You can now sign in." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Verification failed." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: "Invalid email or password." });
    if (!user.isVerified) return res.status(403).json({ error: "Please verify your email before signing in." });
    res.json({ success: true, token: createToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed." });
  }
});

export default router;
