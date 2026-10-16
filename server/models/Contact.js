import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true },
    company: { type: String, default: '', trim: true, maxlength: 100 },
    phone: { type: String, trim: true, maxlength: 20, default: '' },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    ipAddress: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);