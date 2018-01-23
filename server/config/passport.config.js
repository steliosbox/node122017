const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');

const User = require('../models/user.model.js');

const options = { passReqToCallback: true };

const queryFunc = (user) => {
  return {
    access_token: user.access_token,
    username: user.username,
    id: user._id,
    firstName: user.firstName,
    image: user.image,
    surName: user.surName,
    middleName: user.middleName,
    password: user.password,
    permissionId: user.permissionId,
    permission: user.permission
  };
};

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
              const query = queryFunc(newUser);
              done(null, query);
            })
            .catch(err => done(err));
        });
      })
      .catch(err => done(err));
  })
);

passport.use('local.register', new LocalStrategy(options, (req, username, password, done) => {
  // Check if user is already in the db
  User.findOne({ username }, (err, user) => {
    if (err) { // if an error occurred
      if (err.message.match('E11000 duplicate key error')) {
        // If username already reported, send json response to the client
        return done(null, false, { message: 'User already reported!' });
      }
      // else call next with error message
      return done(err);
    }
    else if (user) {
      // Else if user already reported, send json response to the client.
      // That check is in case if in mongoose schema
      // the username is not set to unique = true.
      return done(null, false, { message: 'User already reported!' });
    }
    // -------------------------------------------------------------------
    // Destructuring all data from req.body to a variables
    const { firstName, middleName, surName } = req.body;
    // Preparing object with the data for saving into database
    const query = { username, firstName, middleName, surName };
    // Hashing password
    query.password = User.hashPassword(password);
    // Create new user
    new User(query)
      .save() // saving to database
      .then(user => {
        // Creating token
        jwt.sign({ id: user._id }, process.env.SECRET_KEY, {}, (err, token) => {
          // If an error occurred, call done with error message
          if (err) return done(err);

          user.access_token = token;
          user.save()
            .then(newUser => {
              const query = queryFunc(newUser);
              // send all user info to the client
              done(null, query);
            })
            .catch(err => done(err));
        });
      })
      // If an error occurred
      .catch(err => done(err));
  });
}));

module.exports = passport;
