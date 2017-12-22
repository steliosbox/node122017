const fs = require('fs');
const path = require('path');

let _count = 0;
let _iterations = 1;
let _array = [];

const findFiles = async (url, callback = () => {}) => {
  if (!url) {
    const error = { Error: 'No file specified' };
    return callback(error);
  }

  if (!await fs.existsSync(url)) {
    const error = { Error: 'Directory doesn\'t exist' };
    return callback(error);
  }

  const files = await fs.readdirSync(url);

  if (!_count) {
    if (!files.length) {
      const error = { Error: 'The folder is empty' };
      return callback(error);
    }

    _count = files.length;
  }

  files.forEach(file => {
    const filePath = path.join(url, file);

    fs.stat(filePath, (error, stats) => {
      if (error) {
        return callback(error);
      }

      if (stats.isDirectory()) {
        return findFiles(filePath, callback);
      }

      _array.push({ dir: url, name: file });

      if (_count === _iterations) {
        return callback(null, _array);
      }

      _iterations++;
    });
  });
};

if (module.parent) {
  module.exports = findFiles;
} else {
  findFiles(process.argv[2]);
}
