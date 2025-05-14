const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/initiate-paystack', async (req, res) => {
  const { email, amount } = req.body;

  if (!email || !amount) {
    return res.status(400).json({ error: 'Email and amount are required' });
  }

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount,
      },
      {
        headers: {
          Authorization: `Bearer sk_test_4c2762949471f6a8bf64e57a33044832155d3161`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({
      authorization_url: response.data.data.authorization_url,
    });
  } catch (error) {
    console.error('Paystack init error:', error.message);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
});

module.exports = router;
