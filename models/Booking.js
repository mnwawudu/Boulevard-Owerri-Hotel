const mongoose = require('mongoose');

// Prevent OverwriteModelError for Room reference
const Room = mongoose.models.Room || require('./Room');

const bookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  userId: { type: String },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  roomName: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  transport: {
    type: String,
    enum: ['pickup', 'dropoff', 'both', 'none', null],
    default: 'none'
  },
  roomRevenue: { type: Number, default: 0 },
  transportRevenue: { type: Number, default: 0 },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
