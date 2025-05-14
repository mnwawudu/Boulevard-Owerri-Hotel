const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage, cloudinary } = require('../config/cloudinary');
const upload = multer({ storage });

const Service = require('../models/Service');

// GET all services
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch services', error: err });
  }
});

// ADD new service
router.post('/services', async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add service', error: err });
  }
});

// UPDATE a service
router.put('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update service', error: err });
  }
});

// DELETE a service
router.delete('/services/:id', async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete service', error: err });
  }
});

// UPLOAD images to a service
router.post('/services/:id/images', upload.array('images'), async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const uploadedImages = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
    }));

    service.images.push(...uploadedImages);
    await service.save();

    res.status(200).json({ message: 'Images uploaded', images: service.images });
  } catch (err) {
    res.status(500).json({ message: 'Image upload failed', error: err });
  }
});

// SET main image for a service
router.put('/services/:id/set-main-image', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    service.mainImage = imageUrl;
    await service.save();

    res.json({ message: 'Main image set', mainImage: imageUrl });
  } catch (err) {
    res.status(500).json({ message: 'Failed to set main image', error: err });
  }
});

// DELETE an image from a service
router.delete('/services/:serviceId/images/:publicId', async (req, res) => {
  const { serviceId, publicId } = req.params;
  console.log('🔁 DELETE IMAGE:', serviceId, publicId); // ✅ log here
  try {
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    await cloudinary.uploader.destroy(publicId);

    service.images = service.images.filter(img => img.public_id !== publicId);
    if (service.mainImage && service.mainImage.includes(publicId)) {
      service.mainImage = '';
    }

    await service.save();
    res.status(200).json({ message: 'Image deleted', images: service.images });
  } catch (err) {
    console.error('❌ Failed to delete image:', err);
    res.status(500).json({ message: 'Delete failed' });
  }
});

// TOGGLE showOnHomepage for a service
router.put('/services/:id/toggle-homepage', async (req, res) => {
  console.log('🔁 TOGGLE HOMEPAGE:', req.params.id, '->', req.body.showOnHomepage); // ✅ log here
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    service.showOnHomepage = req.body.showOnHomepage;
    await service.save();

    res.status(200).json({ message: 'Homepage status updated', showOnHomepage: service.showOnHomepage });
  } catch (err) {
    console.error('❌ Failed to toggle homepage status:', err);
    res.status(500).json({ message: 'Toggle failed' });
  }
});

module.exports = router;
