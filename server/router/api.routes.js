const path = require('path');
// -----------------------------------------------------------------------------
// Initializing router
const router = require('express').Router();
// -----------------------------------------------------------------------------
// Routes to api
router.use('/login', require('../api/login.js'));
router.use('/saveNewUser', require('../api/saveNewUser.js'));
router.use('/authFromToken', require('../api/authFromToken.js'));
router.use('/getNews', require('../api/getNews.js'));
router.use('/saveUserImage', require('../api/saveUserImage.js'));
router.use('/updateUser', require('../api/updateUser'));
// -----------------------------------------------------------------------------
// If requested route is not served, send warning to the client
router.use('/', (req, res, next) => {
  const url = path.join('api', req.url);
  const message = `${req.method} ${url} route is not served.`;
  next({ status: 404, message: message });
});

module.exports = router;
