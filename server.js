const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load .env variables

// Routes
const roomRoutes = require('./routes/adminRoomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const publicAvailabilityRoutes = require('./routes/publicAvailabilityRoutes');
const adminServiceRoutes = require('./routes/adminServiceRoutes');
const adminPageRoutes = require('./routes/adminPageRoutes');
const adminAdRoutes = require('./routes/adminAdRoutes');
const transportRoutes = require('./routes/transportRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes'); // ✅ Admin login

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json()); // Replaces body-parser

// ✅ MongoDB Connection
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Route Registrations
app.use('/api/admin', roomRoutes);                   // Rooms
app.use('/api/admin', adminServiceRoutes);           // Services
app.use('/api/admin', adminAdRoutes);                // Ads
app.use('/api/admin', transportRoutes);              // Transport
app.use('/api/admin/pages', adminPageRoutes);        // Page Content
app.use('/api/admin', adminAuthRoutes);              // Admin login route
app.use('/api/bookings', bookingRoutes);             // Bookings
app.use('/api/analytics', analyticsRoutes);          // Booking analytics
app.use('/api/public', publicAvailabilityRoutes);    // Public endpoints (availability, logs)
app.use('/api/payments', paymentRoutes);             // Paystack payments

// ✅ Optional: Fallback for undefined API routes
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// ✅ Launch Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
