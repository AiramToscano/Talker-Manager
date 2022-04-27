const fs = require('fs/promises');

function writeFile(newwrite) {
    return fs.writeFile('./talker.json', JSON.stringify(newwrite));
  }

module.exports = writeFile;
