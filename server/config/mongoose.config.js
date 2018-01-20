// .env
require('dotenv').config();
const mongoose = require('mongoose');
const options =  false ? { useMongoClient: true } : {};

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOOSE_DB, options)
  .then(() => console.log('Mongoose running!'))
  .catch(err => console.log('mongoose Error:', err));

module.exports = mongoose;