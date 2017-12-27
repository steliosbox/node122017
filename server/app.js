const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://hw3:122017node@ds131997.mlab.com:31997/hw3', {
  useMongoClient: true
});

app.disable('x-powered-by');

app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, '../dist')));
app.use('/', require('./routers/index'));

app.use((req, res, next) => {
  res.status(404).send('404 Page not found');
});

app.use((req, res, next) => {
  res.status(500).send('500 Server error');
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port %s', server.address().port);
});
