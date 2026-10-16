import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

const ADMIN_EMAIL = 'admin@divyaputritradex.com';
const ADMIN_PASSWORD = 'admin@12345';
const ADMIN_NAME = 'Admin';

const seed = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) throw new Error('No MongoDB URI in env');

    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log('⚠️  Admin already exists:', ADMIN_EMAIL);
      await mongoose.disconnect();
      return;
    }

    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
      isActive: true,
    });

    console.log('✅ Admin created!');
    console.log('   Email:', ADMIN_EMAIL);
    console.log('   Password:', ADMIN_PASSWORD);
    console.log('   ⚠️  Change the password after first login!');

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();