const router = require('express').Router();
const passport = require('../config/passport.config');

router.post('/', (req, res, next) => {
  passport.authenticate('local.register', (err, user, message) => {
    // If an error occurred, call next with error message
    if (err) return next(err);
    // If is no error and user variable is empty, send to the client the message
    if (!user && message) return res.json(message);
    // If user & message variable is empty,
    // sent to the client that is 'Unknown error occurred'
    if (!user && !message) return res.json({ message: 'Unknown error occurred' });
    // ----------------------------------------------------------------------------
    // set cookie on the client
    res.cookie('access_token', user.access_token, {});
    res.json(user);
  })(req, res, next);
});

module.exports = router;
