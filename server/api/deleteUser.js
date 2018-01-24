const router = require('express').Router();
const User = require('../models/user.model');

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  User.findById(id)
    .then(user => {
      user.remove()
        .catch(err => next(err));
    })
    // If an error occurred, call next with error message
    .catch(err => next(err));
});

module.exports = router;
