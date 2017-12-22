// Функцию можно вызвать как напрямую, так и из скрипта.
// Функция принимает путь до папки откуда нужно считать файлы.
// При вызове напрямую, путь нужно передать как аргумент.
// После завершения поиска, функция возвращает массив с объектами
// где свойство dir - это путь к файлу, а name - это имя самого файла.

const fs = require('fs');
const path = require('path');

let _count = 0;
let _iterations = 1;
let _array = [];

const _stat = url => {
  try {
    const state = fs.statSync(url);
    state.exist = () => true;
    return state;
  } catch (error) {
    if (error.code === 'ENOENT') return { exist: () => false };
  }
};

const findFiles = async (url, callback = () => {}) => {
  if (!url) {
    const error = { Error: 'No file specified' };
    return callback(error);
  }

  const stats = await _stat(url);

  if (!stats.exist) {
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
    const stats = _stat(filePath);

    if (stats.isDirectory()) return findFiles(filePath, callback);

    _array.push({ dir: url, name: file });

    if (_count === _iterations) return callback(null, _array);

    _iterations++;
  });
};

if (module.parent) {
  module.exports = findFiles;
} else {
  findFiles(process.argv[2], (error, state) => {
    if (error) return console.log(error);

    console.log(state);
  });
}
