import mongoose from 'mongoose';

const apartmentViewSchema = new mongoose.Schema({
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  count: { type: Number, default: 1, min: 1 },
  lastViewedAt: { type: Date, default: Date.now, index: true }
}, {
  timestamps: true
});

apartmentViewSchema.index({ user: 1, apartment: 1 }, { unique: true });
apartmentViewSchema.index({ apartment: 1, count: -1 });

export const ApartmentView = mongoose.model('ApartmentView', apartmentViewSchema);
