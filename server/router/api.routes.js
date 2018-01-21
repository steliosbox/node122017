const path = require('path');
// -----------------------------------------------------------------------------
// Initializing router
const router = require('express').Router();
// -----------------------------------------------------------------------------
// Routes to api
router.use('/login', require('../api/login.js'));
// -----------------------------------------------------------------------------
// If requested route is not served, send warning to the client
router.use('/', (req, res, next) => {
  const url = path.join('api', req.url);
  const message = `${req.method} ${url} route is not served.`;
  next({ status: 404, message: message });
});

module.exports = router;
