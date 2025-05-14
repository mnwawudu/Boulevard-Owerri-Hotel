const express = require('express');
const router = express.Router();
const PageContent = require('../models/PageContent');

const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

// GET page by slug
router.get('/:slug', async (req, res) => {
  try {
    const page = await PageContent.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (err) {
    console.error('Failed to fetch page:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE page by slug
router.put('/:slug', async (req, res) => {
  try {
    const page = await PageContent.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, upsert: true }
    );
    res.json(page);
  } catch (err) {
    console.error('Failed to update page:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPLOAD banner image
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.status(200).json({ url: req.file.path });
});

module.exports = router;
