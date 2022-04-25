const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const joi = require('joi');

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

const verifyEmail = (req, res, next) => {
  const { email } = req.body;
 if (email === undefined) {
 return res.status(400).json({ message: 'O campo "email" é obrigatório' });
 }
  const EMAILSCHEMA = joi.object({
    emailverifc: joi.string()
    .required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }) });
 const teste = EMAILSCHEMA.validate({ emailverifc: email });
 const { error } = teste;
  if (error) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  next();
};

const verifyPassword = (req, res, next) => {
  const { password } = req.body;
  if (password === undefined) {
  return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  const EMAILSCHEMA = joi.object({
    passwordverif: joi.string().required().pattern(new RegExp('^[1-9]{6,20}$')),
  });
 const teste = EMAILSCHEMA.validate({ passwordverif: password });
 const { error } = teste;
  if (error) {
     return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};
function geraStringAleatoria(_req, res, _next) {
  let stringAleatoria = '';
  // https://www.webtutorial.com.br/funcao-para-gerar-uma-string-aleatoria-random-com-caracteres-especificos-em-javascript/#:~:text=A%20fun%C3%A7%C3%A3o%20Math.,baixo%20(com%20a%20fun%C3%A7%C3%A3o%20Math.
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i += 1) {
      stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return res.status(200).json({ token: stringAleatoria });
}

app.post('/login', verifyEmail, verifyPassword, geraStringAleatoria);
