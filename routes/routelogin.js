const express = require('express');

const rescue = require('express-rescue');

const { verifyEmail, 
  verifyPassword, geraStringAleatoria } = require('../middlewares/loginmiddleware');

const routerLogin = express.Router();
const HTTP_OK_STATUS = 200;

routerLogin.post('/', rescue(verifyEmail), rescue(verifyPassword), rescue((_req, res) => {
  const tokenValid = geraStringAleatoria();
  res.status(HTTP_OK_STATUS).json({ token: tokenValid });
}));

module.exports = routerLogin;