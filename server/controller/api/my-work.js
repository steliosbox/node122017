const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const mongoose = require('mongoose');
const Projects = require('../../models/projects');

module.exports = (req, res, next) => {
  const form = new formidable.IncomingForm();
  const upload = 'dist/img/work';

  form.uploadDir = path.join(process.cwd(), upload);
  form.parse(req, (err, fields, files) => {
    if (err) return next(err);

    const file = files.file;

    if (!fields.projectName || !fields.projectUrl || !fields.text || !file.size) {
      if (file.path) {
        fs.unlink(file.path, err => {
          if (err) return next(err);
        });
      }

      res.send({ mes: 'Заполните все поля', status: 'Error' });
    }

    fs.rename(file.path, path.join(upload, file.name), err => {
      if (err) return next(err);

      const project = new Projects({
        _id: new mongoose.Types.ObjectId(),
        timestamp: Date.now(),
        name: fields.projectName,
        url: fields.projectUrl,
        description: fields.text,
        image: file.name
      });

      project.save()
        .then(result => res.send({ mes: 'Проект успешно загружен', status: 'OK' }))
        .catch(error => next(error));
    });
  });
};
