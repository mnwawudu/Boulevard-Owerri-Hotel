// Sample Room Creation for Testing
const express = require('express');
const Room = require('../models/Room');
const router = express.Router();

router.post('/create-room', async (req, res) => {
  const { name, description, normalPrice, realTimePrice, promoPrice, isPromoActive, isAvailable, bookedDates } = req.body;

  const newRoom = new Room({
    name,
    description,
    normalPrice,
    realTimePrice,
    promoPrice,
    isPromoActive,
    isAvailable,
    bookedDates,
  });

  try {
    await newRoom.save();
    res.status(201).json({ message: 'Room created successfully', room: newRoom });
  } catch (error) {
    res.status(500).json({ message: 'Error creating room', error });
  }
});

module.exports = router;
