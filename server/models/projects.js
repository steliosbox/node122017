const mongoose = require('mongoose');
const projectsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  timestamp: Number,
  name: String,
  url: String,
  description: String,
  image: String
});

module.exports = mongoose.model('Projects', projectsSchema);
