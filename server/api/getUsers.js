const router = require('express').Router();
const User = require('../models/user.model.js');

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

router.get('/', (req, res, next) => {
  User.find()
    .then(users => {
      const usersArray = [];

      users.forEach(user => {
        const query = queryFunc(user);
        usersArray.push(query);
      });

      res.json(usersArray);
    })
    .catch(err => next(err));
});

module.exports = router;
