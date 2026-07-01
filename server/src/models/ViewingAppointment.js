import mongoose from 'mongoose';

const viewingAppointmentSchema = new mongoose.Schema({
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  preferredAt: { type: Date, required: true, index: true },
  status: {
    type: String,
    enum: ['new', 'confirmed', 'visited', 'cancelled'],
    default: 'new',
    index: true
  },
  note: { type: String, trim: true, maxlength: 1000 },
  adminNote: { type: String, trim: true, maxlength: 1000 }
}, {
  timestamps: true
});

viewingAppointmentSchema.index({ user: 1, apartment: 1, preferredAt: 1 });

export const ViewingAppointment = mongoose.model('ViewingAppointment', viewingAppointmentSchema);
