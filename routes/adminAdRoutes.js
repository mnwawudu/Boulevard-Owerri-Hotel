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
const upload = multer({ dest: 'uploads/' }); // Replace with Cloudinary config if needed

router.get('/ads', getAllAds);
router.post('/ads', createAd);
router.put('/ads/:id', updateAd);
router.delete('/ads/:id', deleteAd);
router.post('/ads/:id/image', upload.single('image'), uploadAdImage);

module.exports = router;
