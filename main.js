const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question (value, callback = () => {}) {
  rl.resume();
  rl.question(value, response => {
    callback(response);
    rl.pause();
  });
}

const findFiles = require('./lib/find-files.js');
const copyFiles = require('./lib/copy-files.js');
const deleteFiles = require('./lib/delete-files.js');

(function () {
  question('Source folder: ', source => {
    findFiles(source, (error, files) => {
      if (error) {
        console.log(error);
        process.exit(1);
      }

      question('Destination folder: ', dist => {
        copyFiles(files, dist, (error, status) => {
          if (error) {
            console.log(error);
            process.exit(1);
          }

          question('Do you want to delete the source folder? (Yes/No): ', response => {
            if (/^y(es)?$/i.test(response)) {
              deleteFiles(source, (error, status) => {
                if (error) {
                  console.log(error);
                  process.exit(1);
                }

                console.log('Operation is completed. The source folder was deleted');
                process.exit(0);
              });
            }

            console.log('Operation is completed. The source folder is not deleted');
            process.exit(0);
          });
        });
      });
    });
  });
})();
