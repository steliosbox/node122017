const mongoose = require('mongoose');
const emailsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  timestamp: Number,
  name: String,
  from: String,
  subject: String,
  text: String
});

module.exports = mongoose.model('Emails', emailsSchema);
