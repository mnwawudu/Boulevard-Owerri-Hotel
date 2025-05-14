const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage, cloudinary } = require('../config/cloudinary');
const upload = multer({ storage });

const mongoose = require('mongoose');
const Room = mongoose.models.Room || require('../models/Room');
const Booking = mongoose.models.Booking || require('../models/Booking');
const adminRoomController = require('../controllers/adminRoomController');

// Admin Room Management
router.get('/rooms', adminRoomController.getAllRooms);
router.post('/rooms', adminRoomController.createRoom);
router.put('/rooms/:id', adminRoomController.updateRoom);
router.delete('/rooms/:id', adminRoomController.deleteRoom);

// ✅ Get single room by ID (used by BookingForm to fetch unavailableDates)
router.get('/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    res.status(200).json({
      _id: room._id,
      name: room.name,
      unavailableDates: room.unavailableDates || [],
    });
  } catch (error) {
    console.error('Get single room failed:', error);
    res.status(500).json({ message: 'Failed to fetch room', error });
  }
});

// Upload images to a room
router.post('/rooms/:id/images', upload.array('images'), async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const uploadedImages = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
    }));

    room.images.push(...uploadedImages);
    await room.save();

    res.status(200).json({ message: 'Images uploaded', images: room.images });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Upload failed', error });
  }
});

// Delete specific image from a room
router.delete('/rooms/:roomId/images/:publicId', async (req, res) => {
  const { roomId, publicId } = req.params;
  try {
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    await cloudinary.uploader.destroy(publicId);

    room.images = room.images.filter(img => img.public_id !== publicId);
    await room.save();

    res.status(200).json({ message: 'Image deleted', images: room.images });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Failed to delete image', error });
  }
});

// Set main image manually
router.put('/rooms/:roomId/set-main-image', async (req, res) => {
  const { imageUrl } = req.body;
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    room.mainImage = imageUrl;
    await room.save();

    res.status(200).json({ message: 'Main image set successfully', mainImage: room.mainImage });
  } catch (error) {
    console.error('Set main image error:', error);
    res.status(500).json({ message: 'Failed to set main image', error });
  }
});

// ✅ Update unavailable dates from calendar modal
router.put('/rooms/:id/calendar', async (req, res) => {
  const { unavailableDates } = req.body;

  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.unavailableDates = unavailableDates;
    await room.save();

    console.log(`[CALENDAR UPDATE] Room: ${room.name} | Unavailable Dates: ${unavailableDates.join(', ')}`);
    res.status(200).json({ message: 'Unavailable dates updated', room });
  } catch (error) {
    console.error('Calendar update failed:', error);
    res.status(500).json({ message: 'Failed to update unavailable dates', error });
  }
});

// ✅ Check if a specific date is available
router.get('/rooms/:id/is-date-available', async (req, res) => {
  const { date } = req.query;

  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const isoQueryDate = new Date(date).toISOString().split('T')[0];
    const normalizedUnavailableDates = room.unavailableDates?.map(d =>
      new Date(d).toISOString().split('T')[0]
    );

    const isUnavailable = normalizedUnavailableDates.includes(isoQueryDate);

    console.log(`[AVAILABILITY CHECK] ${room.name} | ${isoQueryDate} | Available: ${!isUnavailable}`);
    res.status(200).json({ available: !isUnavailable });
  } catch (error) {
    console.error('Availability check failed:', error);
    res.status(500).json({ message: 'Error checking availability', error });
  }
});

// Booking Analytics
router.get('/analytics/bookings', async (req, res) => {
  try {
    const analytics = await Booking.aggregate([
      {
        $group: {
          _id: '$roomName',
          totalBookings: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json(analytics);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ message: 'Failed to get analytics', error });
  }
});

module.exports = router;
