const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Booking = require('../models/Booking');

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Verify Paystack webhook signature
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET)
      .update(req.body)
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      console.error('Invalid webhook signature');
      return res.status(400).send('Invalid signature');
    }

    const event = JSON.parse(req.body);

    if (event.event === 'charge.success') {
      // Mark booking as paid
      const booking = await Booking.findOneAndUpdate(
        { paymentReference: event.data.reference },
        { paymentStatus: 'paid' },
        { new: true }
      );

      if (!booking) {
        console.warn(`Booking not found for reference: ${event.data.reference}`);
      } else {
        console.log(`Booking ${booking._id} marked as paid.`);
      }
    } else if (event.event === 'charge.failed') {
      // Mark booking as failed
      const booking = await Booking.findOneAndUpdate(
        { paymentReference: event.data.reference },
        { paymentStatus: 'failed' },
        { new: true }
      );

      if (!booking) {
        console.warn(`Booking not found for reference: ${event.data.reference}`);
      } else {
        console.log(`Booking ${booking._id} marked as failed.`);
      }
    } else {
      console.log(`Unhandled event type: ${event.event}`);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
