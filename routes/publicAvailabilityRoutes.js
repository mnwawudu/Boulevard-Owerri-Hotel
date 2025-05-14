const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const AvailabilityLog = require('../models/AvailabilityLog');

const VALID_API_KEY = 'boulevard-access-token-2024';

// Middleware to protect public endpoints
const verifyApiKey = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  if (!apiKey || apiKey !== VALID_API_KEY) {
    return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
  }
  next();
};

// ✅ Public Endpoint 1: Today's availability per room
router.get('/availability', verifyApiKey, async (req, res) => {
  try {
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    const rooms = await Room.find();

    const availableRooms = rooms.map(room => {
      const isUnavailableToday = room.unavailableDates?.includes(today);
      return {
        name: room.name,
        price: room.promoPriceActive ? room.promoPrice : room.price,
        guests: room.guests,
        mainImage: room.mainImage || (room.images?.[0]?.url ?? null),
        available: !isUnavailableToday
      };
    });

    await AvailabilityLog.create({
      type: 'today',
      ip: req.ip,
      client: req.header('x-client') || 'unknown',
      userAgent: req.headers['user-agent'] || ''
    });

    res.status(200).json(availableRooms);
  } catch (error) {
    console.error('Availability check failed:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// ✅ Public Endpoint 2: Check availability for a room in a date range
router.get('/availability-range', verifyApiKey, async (req, res) => {
  const { roomId, checkIn, checkOut } = req.query;

  if (!roomId || !checkIn || !checkOut) {
    return res.status(400).json({ message: 'Missing roomId, checkIn, or checkOut' });
  }

  try {
    const overlap = await Booking.findOne({
      roomId,
      $or: [
        { checkInDate: { $lte: new Date(checkOut), $gte: new Date(checkIn) } },
        { checkOutDate: { $lte: new Date(checkOut), $gte: new Date(checkIn) } },
        {
          $and: [
            { checkInDate: { $lte: new Date(checkIn) } },
            { checkOutDate: { $gte: new Date(checkOut) } }
          ]
        }
      ]
    });

    const available = !overlap;

    await AvailabilityLog.create({
      type: 'range',
      roomId,
      checkIn,
      checkOut,
      ip: req.ip,
      client: req.header('x-client') || 'unknown',
      userAgent: req.headers['user-agent'] || ''
    });

    res.status(200).json({ roomId, available });
  } catch (error) {
    console.error('Range-based availability check failed:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// ✅ Public Endpoint 3: Fetch all rooms
router.get('/rooms', verifyApiKey, async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    console.error('Public room fetch failed:', error);
    res.status(500).json({ message: 'Failed to fetch rooms', error });
  }
});

// ✅ Public/Admin Endpoint: Log summary grouped by type + client
router.get('/availability-log-summary', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const summary = await AvailabilityLog.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${today}T00:00:00.000Z`),
            $lte: new Date(`${today}T23:59:59.999Z`)
          }
        }
      },
      {
        $group: {
          _id: { type: "$type", client: "$client" },
          total: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    res.status(200).json(summary);
  } catch (error) {
    console.error("Log summary fetch failed:", error);
    res.status(500).json({ message: "Failed to generate summary", error });
  }
});

module.exports = router;
