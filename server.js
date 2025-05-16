const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // ✅ Load .env variables

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
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

// ✅ Route Registrations
app.use('/api/admin', roomRoutes);                    // Rooms
app.use('/api/admin', adminServiceRoutes);            // Services
app.use('/api/admin', adminAdRoutes);                 // Ads
app.use('/api/admin', transportRoutes);               // Transport
app.use('/api/admin', adminAuthRoutes);               // Admin Login
app.use('/api/admin/pages', adminPageRoutes);         // Page Content
app.use('/api/bookings', bookingRoutes);              // Bookings
app.use('/api/analytics', analyticsRoutes);           // Analytics
app.use('/api/public', publicAvailabilityRoutes);     // Public endpoints
app.use('/api/payments', paymentRoutes);              // Payments

// ✅ Catch-All for Undefined API Routes
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
