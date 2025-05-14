const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },  // e.g. 'about', 'services'
  title: { type: String, required: true },
  subtitle: { type: String },
  bannerImage: { type: String },
  body: { type: String },
  sections: [
    {
      heading: { type: String },
      body: { type: String },
    }
  ],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PageContent', pageContentSchema);
