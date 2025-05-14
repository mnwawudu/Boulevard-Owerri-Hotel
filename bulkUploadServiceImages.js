const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');
const Service = require('./models/Service');

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MongoDB connect
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Load upload plan
const uploadPlanPath = path.join(__dirname, 'service_image_upload_plan.json');
const uploadPlan = JSON.parse(fs.readFileSync(uploadPlanPath, 'utf-8'));

async function uploadImagesForService(serviceName, images) {
  try {
    const service = await Service.findOne({ name: serviceName });
    if (!service) {
      console.warn(`⚠️ Service not found: ${serviceName}`);
      return;
    }

    const uploadedImages = [];

    for (let filePath of images) {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: `boulevard/services/${serviceName.replace(/ /g, "_")}`,
      });
      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    service.images = uploadedImages;
    service.mainImage = uploadedImages[0]?.url || '';
    await service.save();

    console.log(`✅ Updated ${serviceName} with ${uploadedImages.length} images`);
  } catch (err) {
    console.error(`❌ Failed to upload for ${serviceName}:`, err.message);
  }
}

async function runUpload() {
  for (const [serviceName, data] of Object.entries(uploadPlan)) {
    await uploadImagesForService(serviceName, data.images);
  }

  mongoose.disconnect();
}

runUpload();
