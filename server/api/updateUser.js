const router = require('express').Router();
const User = require('../models/user.model');

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

router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const query = {};

  for (const item in req.body) {
    if (item !== 'id') {
      query[item] = req.body[item];
    }
  }

  User.findById(id)
    .then(user => {
      if (query.password) {
        const old = query.oldPassword;
        const pwd = user.password;
        if (old && !User.comparePasswordSync(old, pwd)) {
          return res.json({ message: 'Password is not correct' });
        } else {
          delete query.oldPassword;
          query.password = User.hashPasswordSync(query.password);
        }
      }

      user
        .set(query)
        .save()
        .then(updatedUser => {
          const newUser = queryFunc(updatedUser);
          res.json(newUser);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

module.exports = router;
