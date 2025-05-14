// bulkUpload.js
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const { cloudinary } = require('./config/cloudinary');
const Room = require('./models/Room');

const imageDir = path.join(__dirname, 'boulevard_images');

const roomMap = {
  'Executive Room': [
    'executive room 4.jpg',
    'executive room.jpg',
    'executive room1.jpg'
  ],
  'Studio Room': [
    'studio-room.jpg',
    'studio-room1.jpg'
  ],
  'Twin Executive Room': [
    'executive twin room 2.jpg',
    'executive twin room 3.jpg',
    'executive twin room 4.jpg',
    'executive twin room 5.jpg',
    'executive twin room 6.jpg',
    'executive twin room.jpg'
  ],
  '1 Bedroom Apartment': [
    'ApartmentOne room.jpg',
    'ApartmentOne room1.jpg',
    'ApartmentOne Room2.jpg',
    'ApartmentOne Room3.jpg'
  ],
  '2 Bedroom Apartment': [
    'ApartmentTwo room.jpg',
    'ApartmentTwo Room1.jpg',
    'ApartmentTwo room2.jpg'
  ],
  'Executive Suite': [
    'executive suite.jpg',
    'executive suite3.jpg',
    'executive suite4.jpg',
    'executive-suite1.jpg',
    'executive-suite2.jpg'
  ]
};

async function uploadImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    for (const [roomName, imageFiles] of Object.entries(roomMap)) {
      const room = await Room.findOne({ name: roomName });
      if (!room) {
        console.warn(`⚠️ Room not found: ${roomName}`);
        continue;
      }

      const uploadedImages = [];

      for (const fileName of imageFiles) {
        const filePath = path.join(imageDir, fileName);
        const result = await cloudinary.uploader.upload(filePath, {
          folder: `boulevard-hotel/${roomName.replace(/\s+/g, '-')}`
        });

        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id
        });
      }

      // Set mainImage as the first uploaded image
      room.mainImage = uploadedImages[0].url;

      // Append uploaded images to the room's image array
      room.images = [...uploadedImages];

      await room.save();
      console.log(`✅ Updated room: ${room.name} with ${uploadedImages.length} images`);
    }

    console.log('🎉 All room images uploaded and saved to MongoDB');
    process.exit();
  } catch (error) {
    console.error('❌ Upload failed:', error);
    process.exit(1);
  }
}

uploadImages();
