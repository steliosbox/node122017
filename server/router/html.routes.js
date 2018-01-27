const path = require('path');
// path to index file
const index = path.join(process.cwd(), 'views/index.html');
// -----------------------------------------------------------------------------
// Initializing router
const router = require('express').Router();
// -----------------------------------------------------------------------------
// Redirecting all requests to 'index.html'
router.use((req, res, next) => {
  res.sendFile(index);
});

module.exports = router;
