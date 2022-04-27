const fs = require('fs/promises');

const readtalker = () => {
    const arquive = fs.readFile('./talker.json', 'utf8')
    .then((data) => JSON.parse(data));
    return arquive;
  };

module.exports = readtalker;
