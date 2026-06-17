import mongoose from 'mongoose';

const apartmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  district: { type: String, required: true, index: true },
  districtLabel: { type: String, required: true },
  ward: { type: String, required: true, index: true },
  address: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0, index: true },
  priceLabel: { type: String, required: true },
  rentLabel: { type: String },
  area: { type: Number, required: true, min: 1 },
  bedrooms: { type: Number, required: true, min: 0 },
  bathrooms: { type: Number, required: true, min: 0 },
  type: { type: String, required: true },
  status: { type: String, enum: ['Đang bán', 'Cho thuê'], required: true, index: true },
  availableUnits: { type: Number, default: 1, min: 0, index: true },
  featured: { type: Boolean, default: false },
  tags: [{ type: String, trim: true }],
  image: { type: String, required: true },
  gallery: [{ type: String, trim: true }],
  description: { type: String, trim: true, maxlength: 3000 },
  highlights: [{ type: String, trim: true }],
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  owner: {
    name: { type: String, trim: true },
    encryptedPhone: { type: String }
  }
}, {
  timestamps: true
});

apartmentSchema.index({ district: 1, ward: 1, price: 1, bedrooms: 1, availableUnits: 1 });

export const Apartment = mongoose.model('Apartment', apartmentSchema);
