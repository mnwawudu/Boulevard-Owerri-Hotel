const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: {
    url: String,
    public_id: String
  },
  link: { type: String, default: '' },
  cta: { type: String, default: '' }, // ✅ Added CTA field
  showAd: { type: Boolean, default: false },
  enableRedirect: { type: Boolean, default: false },
  pages: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Ad', adSchema);
