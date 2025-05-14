const express = require('express');
const router = express.Router();
const {
  getTransportPrices,
  updateTransportPrices
} = require('../controllers/transportController');

// GET current prices
router.get('/transport', getTransportPrices);

// PUT to update prices
router.put('/transport', updateTransportPrices);

module.exports = router;
