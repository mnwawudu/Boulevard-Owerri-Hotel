// controllers/transportController.js
const TransportConfig = require('../models/TransportConfig');

const getTransportPrices = async (req, res) => {
  try {
    let config = await TransportConfig.findOne();
    if (!config) {
      config = await TransportConfig.create({});
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load transport prices' });
  }
};

const updateTransportPrices = async (req, res) => {
  try {
    const { pickupOnly, dropoffOnly, both, showTransport } = req.body;

    let config = await TransportConfig.findOne();
    if (!config) {
      config = await TransportConfig.create({ pickupOnly, dropoffOnly, both, showTransport });
    } else {
      config.pickupOnly = pickupOnly;
      config.dropoffOnly = dropoffOnly;
      config.both = both;
      config.showTransport = showTransport !== undefined ? showTransport : config.showTransport;
      await config.save();
    }

    res.json(config);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update transport prices' });
  }
};

module.exports = {
  getTransportPrices,
  updateTransportPrices,
};
