// models/Page.js
const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Page', pageSchema);
