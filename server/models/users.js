const mongoose = require('mongoose');
const usersSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  password: String,
});

module.exports = mongoose.model('Users', usersSchema);
