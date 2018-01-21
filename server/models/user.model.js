const bCrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, default: '' },
  middleName: { type: String, default: '' },
  surName: { type: String, default: '' },
  image: { type: String, default: 'assets/img/no-user-image-big.png' },
  permissionId: { type: Number, default: 1 },
  permission: {
    chat: {
      C: { type: Boolean, default: false },
      R: { type: Boolean, default: true },
      U: { type: Boolean, default: true },
      D: { type: Boolean, default: false }
    },
    news: {
      C: { type: Boolean, default: false },
      R: { type: Boolean, default: true },
      U: { type: Boolean, default: false },
      D: { type: Boolean, default: false }
    },
    setting: {
      C: { type: Boolean, default: false },
      R: { type: Boolean, default: false },
      U: { type: Boolean, default: false },
      D: { type: Boolean, default: false }
    }
  }
});

// Hashing and saving password
UserSchema.methods.setPassord = pwd => {
  const salt = bCrypt.genSaltSync(10);
  this.password = bCrypt.hashSync(pwd, salt, null);
};
// Compare password with the hash saved in db
UserSchema.methods.validPassword = function (pwd) {
  return bCrypt.compareSync(pwd, this.password);
};

// exporting user Schema 
module.exports = mongoose.model('user', UserSchema);
