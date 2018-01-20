const path = require('path');
// -----------------------------------------------------------------------------
// Initializing router
const router = require('express').Router();
// -----------------------------------------------------------------------------
// Routes to api
// ...
// -----------------------------------------------------------------------------
// If requested route is not served, send warning to the client
router.use('/', (req, res, next) => {
  const url = path.join('app', req.url);
  res.json({ message: `'${url}' route is not served!` });
});

module.exports = router;
