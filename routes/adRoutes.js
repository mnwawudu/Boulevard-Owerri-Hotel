const express = require('express');
const router = express.Router();
const {
  createAd,
  updateAd,
  deleteAd,
  getAllAds,
  uploadAdImage
} = require('../controllers/adController');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Can be replaced with Cloudinary multer config

// GET all ads
router.get('/', getAllAds);

// POST create new ad
router.post('/', createAd);

// PUT update ad
router.put('/:id', updateAd);

// DELETE ad
router.delete('/:id', deleteAd);

// POST upload image to ad (with Cloudinary/multer)
router.post('/:id/image', upload.single('image'), uploadAdImage);

module.exports = router;
