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

(() => {
  question('Source folder: ', source => {
    findFiles(source, (error, files) => {
      if (error) return console.log(error);
      question('Destination folder: ', dist => {
        copyFiles(files, dist, (error, status) => {
          console.log(error ? error : status);
        });
      });
    });
  });
})();
