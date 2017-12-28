const mongoose = require('mongoose');
const Users = require('../../models/users');

module.exports = (req, res, next) => {
  const { login, password } = req.body;

  Users.find({ "login": login })
    .exec()
    .then(result => {
      if (!result.length || result[0].password !== password) {
        return res.json({ mes: "Логин и/или пароль введены неверно!", status: "Error" });
      }

      req.session.auth = true;
      res.json({ mes: "Aвторизация успешна!", status: "OK" });
    })
    .catch(error => next(error));
};
