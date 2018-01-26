const router = require('express').Router();
const uuidv1 = require('uuid/v1');

const User = require('../models/user.model');

router.put('/:id', (req, res, next) => {
  const id = req.params.id;

  User.findOne({ permissionId: id })
    .then(user => {
      const permission = req.body.permission;

      for (let item in permission) {
        for (let sub in permission[item]) {
          user.permission[item][sub] = permission[item][sub];
        }
      }

      user.permissionId = uuidv1();
      user.save()
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

module.exports = router;
