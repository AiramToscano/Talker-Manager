const joi = require('joi');

const HTTP_BAD_REQUEST = 400;
const NUMBER_TWO = 2;
const NUMBER_ONE = 1;
const NUMBER_ZERO = 0;
const MAX_CHARACTER = 16;

const verifyEmail = (req, res, next) => {
    const { email } = req.body;
   if (email === undefined) {
   return res.status(HTTP_BAD_REQUEST).json({ message: 'O campo "email" é obrigatório' });
   }
    const EMAILSCHEMA = joi.object({
      emailverifc: joi.string()
      .required().email({ minDomainSegments: NUMBER_TWO, tlds: { allow: ['com', 'net'] } }) });
   const teste = EMAILSCHEMA.validate({ emailverifc: email });
   const { error } = teste;
    if (error) {
      return res.status(HTTP_BAD_REQUEST)
      .json({ message: 'O "email" deve ter o formato "email@email.com"' });
    }
    next();
  };
  
  const verifyPassword = (req, res, next) => {
    const { password } = req.body;
    if (password === undefined) {
    return res.status(HTTP_BAD_REQUEST)
    .json({ message: 'O campo "password" é obrigatório' });
    }
    const EMAILSCHEMA = joi.object({
      passwordverif: joi.string().required().pattern(new RegExp('^[1-9]{6,20}$')),
    });
   const teste = EMAILSCHEMA.validate({ passwordverif: password });
   const { error } = teste;
    if (error) {
       return res.status(HTTP_BAD_REQUEST)
       .json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
    }
    next();
  };
  function geraStringAleatoria() {
    let stringAleatoria = '';
    // https://www.webtutorial.com.br/funcao-para-gerar-uma-string-aleatoria-random-com-caracteres-especificos-em-javascript/#:~:text=A%20fun%C3%A7%C3%A3o%20Math.,baixo%20(com%20a%20fun%C3%A7%C3%A3o%20Math.
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = NUMBER_ZERO; i < MAX_CHARACTER; i += NUMBER_ONE) {
        stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return stringAleatoria;
  }

module.exports = {
    verifyEmail,
    verifyPassword,
    geraStringAleatoria,
};
