const fs = require('fs');

const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });
};

module.exports = {
  readFile
};
