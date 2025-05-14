// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Booking analytics: count bookings per room category
router.get('/room-bookings', async (req, res) => {
  try {
    const result = await Booking.aggregate([
      {
        $group: {
          _id: '$roomName',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

module.exports = router;
