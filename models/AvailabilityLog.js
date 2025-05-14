const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['today', 'range'],
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: function () {
      return this.type === 'range';
    }
  },
  checkIn: String,
  checkOut: String,
  ip: String,
  client: {
    type: String,
    default: 'unknown'
  },
  userAgent: String
}, { timestamps: true });

module.exports = mongoose.model('AvailabilityLog', logSchema);
