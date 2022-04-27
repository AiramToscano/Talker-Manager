const express = require('express');

const router = express.Router();
const { validtoken, verifyUsername, 
   validtalkwatch, validAge, validtalkRate } = require('../middlewares/talkermiddleware');
const readtalker = require('../utils/readfile');
const writeFile = require('../utils/writefile');

const HTTP_OK_STATUS = 200;
const NOT_FOUND_STATUS = 404;
const HTTP_CREATED_STATUS = 201;
const HTTP_NO_CONTENT = 204;
const NUMBER_ONE = 1;

router.get('/search', validtoken, async (req, res) => {
    const { q } = req.query;
    const talker = await readtalker();
    if (q === undefined) return res.status(HTTP_OK_STATUS).json(talker);
    const filtername = talker.filter((e) => e.name.includes(q));
    return res.status(HTTP_OK_STATUS).json(filtername);
  });
  
  router.get('/', async (_req, res) => {
    const talker = await readtalker();
    if (talker.length < NUMBER_ONE) return res.status(HTTP_OK_STATUS).json([]);
    return res.status(HTTP_OK_STATUS).json(talker);
  });
  
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const talker = await readtalker();
    const filterId = talker.find((e) => Number(e.id) === Number(id));
    if (filterId) return res.status(HTTP_OK_STATUS).json(filterId);
  return res.status(NOT_FOUND_STATUS).json({ message: 'Pessoa palestrante não encontrada' });
  });
  
  router.post('/', validtoken, 
  verifyUsername, validAge, validtalkwatch, validtalkRate, async (req, res) => {
    const data = req.body;
    const talker = await readtalker();
    const id = talker.length + NUMBER_ONE;
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
    writeFile(talker);
    return res.status(HTTP_CREATED_STATUS).json(obj);
  });
  
  router.put('/:id', validtoken, 
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
    writeFile(vet);
    return res.status(HTTP_OK_STATUS).json(obj);
  });
  
  router.delete('/:id', validtoken, async (req, res) => {
    const data = req.params;
    const people = await readtalker();
    const id = Number(data.id);
    const filterId = people.filter((e) => e.id !== id);
    writeFile(filterId);
    return res.status(HTTP_NO_CONTENT).end();
  });

module.exports = router;
