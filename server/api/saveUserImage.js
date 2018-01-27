const path = require('path');
const fs = require('fs');
const router = require('express').Router();
const formidable = require('formidable');

const publicRoot = 'public_html';
const uploads = 'uploads';
const uploadsDir = path.join(process.cwd(), publicRoot, uploads);

((dir) => {
  const exist = fs.existsSync(dir);
  if (!exist) {
    fs.mkdir(dir, err => {
      if (err) throw err;
    });
  }
})(uploadsDir);

router.post('/:id', (req, res, next) => {
  const id = req.params.id;
  const form = new formidable.IncomingForm();

  form.uploadDir = uploadsDir;
  form.parse(req, (err, fields, files) => {
    // If an error occurred ----------------------------------------------------
    if (err) {
      try {
        const dir = files[id].path;
        // check if the file was created
        const exist = fs.existsSync(dir);
        if (!exist) {
          // remove file
          fs.unlink(dir, err => {
            // If an error occurred throw err
            if (err) throw err;
          });
        }
      } catch (err) {
        // call next with error message
        return next(err);
      }
    }

    // -------------------------------------------------------------------------
    // If file is not selected or file size is 0
    if (!files[id].path || !files[id].size) {
      return res.json({ message: 'No file!' });
    }
    // Destructuring all data from files to a variables
    const { path: dir, name } = files[id];
    // Determine the file extension
    const ext = path.extname(name);
    // timestamp
    const timestamp = Date.now();
    // Creating new file name with timestamp as a name
    // and extension of original file
    const newFileName = timestamp + ext;

    try {
      // check if the file was created
      const exist = fs.existsSync(dir);
      if (exist) {
        const newPath = path.join(uploadsDir, newFileName);
        // rename file
        fs.rename(dir, newPath, err => {
          // If an error occurred throw err
          if (err) throw err;

          const src = path.join(uploads, newFileName);
          res.json({ path: src });
        });
      }
    } catch (err) {
      // call next with error message
      return next(err);
    }
  });
});

module.exports = router;
