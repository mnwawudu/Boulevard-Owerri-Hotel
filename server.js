const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

// Initialize environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;  // Default to 5000 if not specified in environment

// Middleware
app.use(cors());
app.use(bodyParser.json());  // Handle JSON data
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Simple test route
app.get('/', (req, res) => {
  res.send('Welcome to the Boulevard Hotel API!');
});

// Example route to initiate a payment (for Paystack or other integrations)
app.post('/api/payments/initiate', (req, res) => {
  const { name, email, room, checkIn, checkOut, amount } = req.body;
  
  // Here, you’d integrate with Paystack or other payment gateway
  
  // For now, sending mock URL to simulate Paystack redirection
  res.json({ url: 'https://paystack.com/redirect-mock' });
});

// Email confirmation route (use Nodemailer here)
app.post('/api/send-email', (req, res) => {
  const { email, name, room, checkIn, checkOut, amount } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Booking Confirmation',
    text: `Hello ${name},\n\nYour booking for the ${room} is confirmed.\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nAmount Paid: ₦${amount}\n\nThank you for booking with us!\nBoulevard Hotel`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email');
    } else {
      return res.status(200).send('Email sent: ' + info.response);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
