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

passport.use('local.login', 
  new LocalStrategy(options, (req, username, password, done) => {
    User.findOne({ username })
      .then(result => {
        if (result.validPassword(password)) {
          return result;
        } else done(null, false);
      })
      .then(user => {
          const payload = { username: user.username, id: user._id };
          const secret = req.userIp;
          
          jwt.sign(payload, secret, (err, token) => {
            if (err) throw err;

            payload.access_token = token;
            payload.image = user.image;
            payload.firstName = user.firstName; 
            payload.surName = user.surName;
            payload.middleName = user.middleName;
            payload.permissionId = user.permissionId;
            payload.permission = user.permission;
              
            done(null, payload);
          });
      })
      .catch(err => done(err));
  })
);

module.exports = passport;