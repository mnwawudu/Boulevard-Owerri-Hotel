const mongoose = require('mongoose');

const archivedBookingSchema = new mongoose.Schema({
  roomId: mongoose.Schema.Types.ObjectId,
  roomName: String,
  fullName: String,
  email: String,
  phoneNumber: String,
  checkInDate: Date,
  checkOutDate: Date,
  paymentStatus: String,
  transport: String,
  roomRevenue: Number,
  transportRevenue: Number
}, { timestamps: true });

module.exports = mongoose.model('ArchivedBooking', archivedBookingSchema);
