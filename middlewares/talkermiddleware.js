const joi = require('joi');

// const { geraStringAleatoria } = require('./loginmiddleware');

const NO_UNAUTHORIZED = 400;
const validtoken = (req, res, next) => {
  // const token = geraStringAleatoria();
  const data = req.headers;
  if (data.authorization === undefined) {
  return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (data.authorization.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
    }
  return next();
};

const verifyUsername = (req, res, next) => {
  const data = req.body;
  const { name } = data;
    if (name === undefined) {
      return res.status(NO_UNAUTHORIZED).json({ message: 'O campo "name" é obrigatório' });
      }
    const PASSWORDSCHEMA = joi.object({
      nameverif: joi.string().required().min(3),
    });
   const teste = PASSWORDSCHEMA.validate({ nameverif: name });
   const { error } = teste;
    if (error) { 
    return res.status(NO_UNAUTHORIZED)
    .json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
    }
   return next();
  };

const validAge = (req, res, next) => {
  const data = req.body;
  const { age } = data;
  if (age === undefined) {
    return res.status(NO_UNAUTHORIZED)
    .json({ message: 'O campo "age" é obrigatório' });
    }
    if (age < 18) {
      return res.status(NO_UNAUTHORIZED)
      .json({ message: 'A pessoa palestrante deve ser maior de idade' });
      }
      return next();
};

const validtalkwatch = (req, res, next) => {
  const data = req.body;
  const { talk } = data;
  const dateregex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (talk === undefined || talk.watchedAt === undefined) {
    return res.status(NO_UNAUTHORIZED)
    .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
  }
  if (dateregex.test(talk.watchedAt)) {
    return next();
  }
  return res.status(NO_UNAUTHORIZED)
  .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
};

const validtalkRate = (req, res, next) => {
  const data = req.body;
  const { talk } = data;
  if (talk === undefined || talk.rate === undefined) {
    return res.status(NO_UNAUTHORIZED)
    .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
  }
  if (talk.rate >= 1 && talk.rate <= 5) return next();
  return res.status(NO_UNAUTHORIZED)
  .json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
};

  module.exports = {
    validtoken,
    verifyUsername,
    validAge,
    validtalkwatch,
    validtalkRate,
};
