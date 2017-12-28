const mongoose = require('mongoose');
const emailsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  from: String,
  subject: String,
  text: String,
  timestamp: {
    type: Number,
    default: Date.now
  }
});

module.exports = mongoose.model('Emails', emailsSchema);
