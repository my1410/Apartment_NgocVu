import mongoose from 'mongoose';

const apartmentInterestSchema = new mongoose.Schema({
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed'],
    default: 'new',
    index: true
  },
  note: { type: String, trim: true, maxlength: 1000 }
}, {
  timestamps: true
});

apartmentInterestSchema.index({ apartment: 1, user: 1 }, { unique: true });

export const ApartmentInterest = mongoose.model('ApartmentInterest', apartmentInterestSchema);
