// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Data model
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  company: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// Contact form route
app.post('/contact', async (req, res) => {
  const { name, email, company, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, message required.' });
  }

  try {
    const newContact = new Contact({ name, email, company, message });
    await newContact.save();
    console.log('✅ Data saved:', newContact);

    res.status(200).json({ message: 'Message saved successfully!' });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Failed to save data.' });
  }
});

// Health check (Render ke liye zaroori)
app.get('/health', (req, res) => res.send('OK'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});