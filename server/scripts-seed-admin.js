import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./models/User.js";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "");
  if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first.");
  const hash = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate({ email }, { name: "Administrator", email, password: hash, role: "admin", isVerified: true }, { upsert: true, new: true, setDefaultsOnInsert: true });
  console.log(`Admin account ready: ${email}`);
  await mongoose.disconnect();
};
run().catch((err) => { console.error(err); process.exit(1); });
