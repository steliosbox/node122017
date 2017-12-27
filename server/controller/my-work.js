const mongoose = require('mongoose');
const Projects = require('../models/projects');

module.exports = (req, res, next) => {
  Projects.find()
    .exec()
    .then(projects => res.render('my-work', { 'projects': projects }))
    .catch(error => next(error));
};
