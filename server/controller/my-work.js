const mongoose = require('mongoose');
const Projects = require('../models/projects');

module.exports = (req, res, next) => {
  console.log(req.session.auth);
  Projects.find()
    .exec()
    .then(projects => res.render('my-work', { 'projects': projects, 'auth': req.session.auth }))
    .catch(error => next(error));
};
