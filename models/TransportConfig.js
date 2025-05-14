// models/TransportConfig.js
const mongoose = require('mongoose');

const transportConfigSchema = new mongoose.Schema({
  pickupOnly: { type: Number, default: 20000 },
  dropoffOnly: { type: Number, default: 15000 },
  both: { type: Number, default: 30000 },
  showTransport: { type: Boolean, default: true }, // ✅ Added for toggle
});

module.exports = mongoose.model('TransportConfig', transportConfigSchema);
