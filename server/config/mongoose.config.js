// .env
require('dotenv').config();
const mongoose = require('mongoose');
// const options = (true === false) ? { useMongoClient: true } : {};

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOOSE_DB, { useMongoClient: true })
  .then(() => console.log('Mongoose running!'))
  .catch(err => console.log('mongoose Error:', err));

module.exports = mongoose;
