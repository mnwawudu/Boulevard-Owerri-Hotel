const Booking = require('../models/Booking');
const Room = require('../models/Room');

const createBooking = async (req, res) => {
  try {
    const {
      roomId,
      fullName,
      email,
      phoneNumber,
      checkInDate,
      checkOutDate,
      paymentStatus = 'pending',
      transport
    } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const isoCheckIn = new Date(checkInDate).toISOString().split('T')[0];
    if (room.bookedDates.includes(isoCheckIn)) {
      return res.status(400).json({ message: `Room is fully booked on ${isoCheckIn}` });
    }

    const roomRate = room.promoPriceActive && room.promoPrice ? room.promoPrice : room.price;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)) || 1;

    let transportRevenue = 0;
    if (transport === 'pickup') transportRevenue = 20000;
    if (transport === 'dropoff') transportRevenue = 15000;
    if (transport === 'both') transportRevenue = 30000;

    const roomRevenue = roomRate * nights;

    const newBooking = new Booking({
      roomId,
      roomName: room.name,
      fullName,
      email,
      phoneNumber,
      checkInDate,
      checkOutDate,
      paymentStatus,
      transport: transport || null,
      roomRevenue,
      transportRevenue
    });

    await newBooking.save();

    res.status(201).json({ message: 'Booking successful', booking: newBooking });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Fetch bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error('Booking detail fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingDetails
};
