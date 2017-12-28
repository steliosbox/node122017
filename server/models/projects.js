const mongoose = require('mongoose');
const projectsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  url: String,
  description: String,
  image: String,
  timestamp: {
    type: Number,
    default: Date.now
  }
});

module.exports = mongoose.model('Projects', projectsSchema);
