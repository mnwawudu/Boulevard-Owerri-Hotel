const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  images: [
    {
      url: String,
      public_id: String,
    },
  ],
  mainImage: { type: String },
  showOnHomepage: { type: Boolean, default: false },
  visibleOnServicesPage: { type: Boolean, default: true }
});

module.exports = mongoose.model('Service', serviceSchema);
