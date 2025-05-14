const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: String,
  public_id: String,
});

const roomSchema = new mongoose.Schema({
  name: String,
  price: Number,
  promoPrice: Number,
  promoPriceActive: Boolean,
  beds: String,
  guests: Number,
  complimentary: String, // ✅ Newly added field
  description: String,
  mainImage: String,
  images: [imageSchema],
  bookedDates: [String], // ✅ Used by CalendarModal and checked on frontend
  unavailableDates: [String],
});

// ✅ Add method to check if a date is booked
roomSchema.methods.isDateBooked = function (date) {
  const isoDate = new Date(date).toISOString().split('T')[0];
  return this.bookedDates.includes(isoDate);
};

module.exports = mongoose.models.Room || mongoose.model('Room', roomSchema);
