const formidable = require('formidable');
const mongoose = require('mongoose');
const Users = require('../../models/users');

module.exports = (req, res, next) => {
  let form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) return next(err);

    Users.find({ "login": fields.login })
      .exec()
      .then(result => {
        if (!result.length || result[0].password !== fields.password) {
          return res.json({ mes: "Логин и/или пароль введены неверно!", status: "Error" });
        }

        res.json({ mes: "Aвторизация успешна!", status: "OK" });
      })
      .catch(error => next(error));
  });
};
