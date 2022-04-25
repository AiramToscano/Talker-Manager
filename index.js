const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const NOT_FOUND_STATUS = 404;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

const readtalker = () => {
  const arquive = fs.readFile('./talker.json', 'utf8')
  .then((data) => JSON.parse(data));
  return arquive;
};

app.get('/talker', async (_req, res) => {
  const talker = await readtalker();
  if (talker.length < 1) return res.status(HTTP_OK_STATUS).json([]);
  return res.status(HTTP_OK_STATUS).json(talker);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = await readtalker();
  const filterId = talker.find((e) => Number(e.id) === Number(id));
  if (filterId) return res.status(HTTP_OK_STATUS).json(filterId);
return res.status(NOT_FOUND_STATUS).json({ message: 'Pessoa palestrante não encontrada' });
});
