const fs = require('fs');
const path = require('path');

const deleteFolderRecursive = (path, callback = () => {}) => {
  try {
    if (fs.existsSync(path)) {

      fs.readdirSync(path).forEach((file, index) => {
        let curPath = `${path}/${file}`;

        // recurse
        if (fs.lstatSync(curPath).isDirectory()) return deleteFolderRecursive(curPath);

        fs.unlinkSync(curPath); // delete file
      });

      fs.rmdirSync(path);

      return callback(null, 'done');
    }

    return callback(null, 'don\'t exists');
  } catch (error) {

    return callback(error);
  }
};

if (module.parent) {
  module.exports = deleteFolderRecursive;
} else {
  deleteFolderRecursive(process.argv[2], (error, status) => {
    console.log(error ? error : status);
  });
}

