const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const { validtoken, verifyUsername, 
   validtalkwatch, validAge, validtalkRate } = require('./middlewares/talkermiddleware');
const { verifyEmail, 
  verifyPassword, geraStringAleatoria } = require('./middlewares/loginmiddleware');

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
app.get('/talker/search', validtoken, async (req, res) => {
  const { q } = req.query;
  const talker = await readtalker();
  if (q === undefined) return res.status(200).json(talker);
  const filtername = talker.filter((e) => e.name.includes(q));
  return res.status(200).json(filtername);
});

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

app.post('/login', verifyEmail, verifyPassword, (_req, res) => {
  const tokenValid = geraStringAleatoria();
  res.status(200).json({ token: tokenValid });
});

app.post('/talker', validtoken, 
verifyUsername, validAge, validtalkwatch, validtalkRate, async (req, res) => {
  const data = req.body;
  const talker = await readtalker();
  const id = talker.length + 1;
  const { name, age, talk } = data;
  const { watchedAt, rate } = talk;
  const obj = {
    age,
    name,
    id,
    talk: {
      rate,
      watchedAt,
    },
  };
  talker.push(obj);
  fs.writeFile('./talker.json', JSON.stringify(talker));
  return res.status(201).json(obj);
});

app.put('/talker/:id', validtoken, 
verifyUsername, validAge, validtalkwatch, validtalkRate, (req, res) => {
  const vet = [];
  const { name, age, talk } = req.body;
  const data = req.params;
  const id = Number(data.id);
  const { watchedAt, rate } = talk;
  const obj = {
    age,
    id,
    name,
    talk: {
      rate,
      watchedAt,
    },
  };
  vet.push(obj);
  fs.writeFile('./talker.json', JSON.stringify(vet));
  return res.status(200).json(obj);
});

app.delete('/talker/:id', validtoken, async (req, res) => {
  const data = req.params;
  const people = await readtalker();
  const id = Number(data.id);
 const filterId = people.filter((e) => e.id !== id);
  fs.writeFile('./talker.json', JSON.stringify(filterId));
  return res.status(204).end();
});
