const mongoose = require('mongoose');
const usersSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  password: String,
  timestamp: {
    type: Number,
    default: Date.now
  }
});

module.exports = mongoose.model('Users', usersSchema);
