const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');

const User = require('../models/user.model.js');

const options = { passReqToCallback: true };

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
// local login
passport.use('local.login',
  new LocalStrategy(options, (req, username, password, done) => {
    User.findOne({ username })
      .then(result => {
        if (result.validPassword(password)) {
          return result;
        }
        else done(null, false);
      })
      .then(user => {
        const payload = { id: user._id };

        jwt.sign(payload, process.env.SECRET_KEY, (err, token) => {
          if (err) throw err;

          user.access_token = token;
          user.save()
            .then(newUser => {
              done(null, newUser);
            })
            .catch(err => done(err));
        });
      })
      .catch(err => done(err));
  })
);


module.exports = passport;
