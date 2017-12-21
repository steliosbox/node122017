const fs = require('fs');
const path = require('path');

let _count = 0;
let _iterations = 1;
let _array = [];

const findFiles = async (url, callback = () => {}) => {

  if (!url) {
    return callback({ Error: 'No file specified' });
  }

  if (!await fs.existsSync(url)) {
    return callback({ Error: 'Directory doesn\'t exist' });
  }

  const files = await fs.readdirSync(url);

  if (!_count) {
    if (!files.length) {
      return callback({ Error: 'The folder is empty' });
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
