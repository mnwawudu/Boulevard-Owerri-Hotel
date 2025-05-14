require('dotenv').config();
const mongoose = require('mongoose');
const AvailabilityLog = require('../models/AvailabilityLog');
const Booking = require('../models/Booking');
const ArchivedBooking = require('../models/ArchivedBooking');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is missing in your .env file.');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(async () => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90); // 90-day retention

    // ✅ 1. Clean old availability logs
    const logResult = await AvailabilityLog.deleteMany({ createdAt: { $lt: cutoff } });
    console.log(`✅ ${logResult.deletedCount} availability logs older than 90 days were deleted.`);

    // ✅ 2. Archive old bookings
    const oldBookings = await Booking.find({ checkOutDate: { $lt: cutoff } });

    if (oldBookings.length > 0) {
      await ArchivedBooking.insertMany(oldBookings);
      await Booking.deleteMany({ _id: { $in: oldBookings.map(b => b._id) } });
      console.log(`✅ ${oldBookings.length} bookings archived and removed from active bookings.`);
    } else {
      console.log('ℹ️ No old bookings found to archive.');
    }

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });
