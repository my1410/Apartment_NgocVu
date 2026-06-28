import mongoose from 'mongoose';

const contactRequestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  encryptedPhone: { type: String },
  district: { type: String, trim: true },
  budget: { type: String, trim: true },
  message: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed'],
    default: 'new'
  }
}, {
  timestamps: true
});

export const ContactRequest = mongoose.model('ContactRequest', contactRequestSchema);
