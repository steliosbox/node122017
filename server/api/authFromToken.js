const router = require('express').Router();
const passport = require('../config/passport.config.js');
const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');

const queryFunc = user => {
  return {
    access_token: user.access_token,
    id: user._id,
    username: user.username,
    password: user.password,
    firstName: user.firstName,
    surName: user.surName,
    middleName: user.middleName,
    image: user.image,
    permission: user.permission,
    permissionId: user.permissionId
  };
};

router.post('/', (req, res, next) => {
  const token = req.cookies.access_token || req.body.access_token;
  // Verifing tokent
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    // Throw error if occurred. Set status 406
    if (err) {
      err.status = 416;
      return next(err);
    }
    // check if the user id & token is match
    User.findOne({ _id: decoded.id })
      .then(result => {
        // throw an error if no matches found
        if (!result)
          throw new Error('No user found!');
        // if user found go to next then
        return result;
      })
      .then(user => {
        // prepare payload for new token
        const payload = { id: user._id };
        // create new token
        jwt.sign(payload, process.env.SECRET_KEY, (err, newToken) => {
          // update current's user token
          user.access_token = newToken;
          user.save()
            .then(newUser => {
              // save new token in cookie
              res.cookie('access_token', newUser.access_token);
              const query = queryFunc(newUser);
              // send user's data to client
              res.json(query);
            })
            // throw an error if occurred
            .catch(err => {
              err.status = 406;
              next(err);
            });
        });
      })
      .catch(err => {
        err.status = 406;
        next(err);
      });
  });
});

module.exports = router;
