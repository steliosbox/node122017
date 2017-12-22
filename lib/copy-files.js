const fs = require('fs');
const path = require('path');

module.exports = async (files, dist, callback = () => {}) => {
  if (!await fs.existsSync(dist)) {
    fs.mkdir(dist, 0o744, error => {
      if (error) return callback(error);
    });
  }

  files.forEach(file => {
    const source = path.join(file.dir, file.name);

    fs.stat(source, (error, stats) => {
      if (error) return callback(error);
      if (!stats.isFile()) {
        const error = { Error: `No such file, stat ${file}` };
        return callback(error);
      }

      const newDist = path.join(dist, file.name);

      if (!fs.existsSync(newDist)) {
        fs.link(source, newDist, error => {
          if (error) return callback(error);
        });
      }
    });
  });

  callback(null, 'OK');
};
