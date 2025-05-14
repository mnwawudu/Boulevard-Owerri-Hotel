const AvailabilityLog = require('../models/AvailabilityLog');

const getAvailabilityLogs = async (req, res) => {
  try {
    const logs = await AvailabilityLog.find()
      .sort({ createdAt: -1 })
      .populate('roomId', 'name'); // ✅ populate only the room name

    res.status(200).json(logs);
  } catch (err) {
    console.error('Failed to fetch availability logs:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAvailabilityLogs,
};
