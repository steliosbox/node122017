const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  text: { type: String, required: true },
  theme: { type: String, required: true },
  date: { type: String, default: Date.now }
});

module.exports = mongoose.model('news', newsSchema);
