import mongoose from 'mongoose';

const chatLogSchema = new mongoose.Schema(
  {
    userMessage: { type: String, required: true, trim: true, maxlength: 500 },
    aiReply: { type: String, required: true, trim: true, maxlength: 2000 },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('ChatLog', chatLogSchema);