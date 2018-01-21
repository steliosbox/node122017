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
    // Set expires cookie maxAge
    const expires = 1000 * 60 * 60 * 24 * 30; // 30 days;
    // If 'remembered' is equal to 'true', cookie will be set with expires value
    // Else if 'remembered' is equal to 'undefined' || 'false',
    // cookie well be set without expires value and will hold only for session
    const options = req.body.remembered ? { maxAge: expires } : {};
    // Set cookie on the client
    res.cookie('access_token', user.access_token, options);
    // Send user data to client
    res.json(user);
  })(req, res, next);
});

module.exports = router;
