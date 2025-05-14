const Room = require('../models/Room');

// ✅ GET all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rooms.' });
  }
};

// ✅ POST create a new room
exports.createRoom = async (req, res) => {
  try {
    const room = new Room(req.body);
    const savedRoom = await room.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(400).json({ message: 'Room creation failed.', error });
  }
};

// ✅ PUT update room (with complimentary included)
exports.updateRoom = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      promoPrice,
      promoPriceActive,
      beds,
      guests,
      unavailableDates,
      complimentary,
    } = req.body;

    const updated = await Room.findByIdAndUpdate(
      req.params.id,
      {
        ...(typeof name !== 'undefined' && { name }),
        ...(typeof description !== 'undefined' && { description }),
        ...(typeof price !== 'undefined' && { price }),
        ...(typeof promoPrice !== 'undefined' && { promoPrice }),
        ...(typeof promoPriceActive !== 'undefined' && { promoPriceActive }),
        ...(typeof beds !== 'undefined' && { beds }),
        ...(typeof guests !== 'undefined' && { guests }),
        ...(typeof unavailableDates !== 'undefined' && { unavailableDates }),
        ...(typeof complimentary !== 'undefined' && { complimentary }),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Update failed.', error });
  }
};

// ✅ DELETE a room
exports.deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete room.', error });
  }
};
