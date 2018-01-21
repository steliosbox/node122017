const router = require('express').Router();
const passport = require('../config/passport.config.js');

router.post('/', (req, res, next) => {
  // passport.authenticate for login Strategy
  passport.authenticate('local.login', (err, user) => {
    // If an error occurred, call next with error message
    if (err) return next(err);
    // If user is false, send 'Auth failed' messageto to client
    if (!user) return res.json({ message: 'Auth failed' });
    // -------------------------------------------------------------------------
    // Set cookie on the client
    res.cookie('access_token', user.access_token);
    // Send user data to client
    res.json(user);
  })(req, res, next);
});

module.exports = router;
