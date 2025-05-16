// seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hashedPassword = await bcrypt.hash('Boulevard2023@#!', 10);

  await User.create({
    name: 'Super Admin',
    email: 'boulevardowerrihotel@gmail.com', // ✅ Your real admin login email
    password: hashedPassword,
    role: 'admin'
  });

  console.log('✅ Admin user created with email: boulevardowerrihotel@gmail.com');
  process.exit();
}).catch(err => {
  console.error('❌ MongoDB connection failed:', err);
});
