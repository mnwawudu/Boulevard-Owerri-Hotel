const Ad = require('../models/Ad');
const cloudinary = require('../utils/cloudinary'); // Optional if using Cloudinary

// GET all ads
const getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    console.error('Get ads failed:', err);
    res.status(500).json({ message: 'Failed to fetch ads' });
  }
};

// CREATE new ad
const createAd = async (req, res) => {
  try {
    const ad = new Ad({
      title: req.body.title,
      link: req.body.link || '',
      cta: req.body.cta || '',
      enableRedirect: req.body.enableRedirect || false,
      showAd: req.body.showAd || false,
      pages: req.body.pages || [],
    });

    const saved = await ad.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Create ad failed:', err);
    res.status(500).json({ message: 'Failed to create ad' });
  }
};

// UPDATE existing ad
const updateAd = async (req, res) => {
  try {
    console.log('Received data in updateAd:', req.body); // ✅ Log incoming data

    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: 'Ad not found' });

    ad.title = req.body.title || ad.title;
    ad.link = req.body.link || ad.link;
    ad.cta = req.body.cta || ''; // ✅ Update CTA
    ad.enableRedirect = req.body.enableRedirect !== undefined ? req.body.enableRedirect : ad.enableRedirect;
    ad.showAd = req.body.showAd !== undefined ? req.body.showAd : ad.showAd;
    ad.pages = req.body.pages || ad.pages;

    if (req.body.image === null) {
      ad.image = null;
    }

    const updatedAd = await ad.save();
    res.json(updatedAd);
  } catch (err) {
    console.error('Update ad failed:', err);
    res.status(500).json({ message: 'Failed to update ad' });
  }
};

// DELETE ad
const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if (!ad) return res.status(404).json({ message: 'Ad not found' });
    res.json({ message: 'Ad deleted' });
  } catch (err) {
    console.error('Delete ad failed:', err);
    res.status(500).json({ message: 'Failed to delete ad' });
  }
};

// UPLOAD image for ad
const uploadAdImage = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: 'Ad not found' });

    const result = await cloudinary.uploader.upload(req.file.path);
    ad.image = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    await ad.save();
    res.json({ message: 'Image uploaded', image: ad.image });
  } catch (err) {
    console.error('Image upload failed:', err);
    res.status(500).json({ message: 'Image upload failed' });
  }
};

module.exports = {
  getAllAds,
  createAd,
  updateAd,
  deleteAd,
  uploadAdImage
};
