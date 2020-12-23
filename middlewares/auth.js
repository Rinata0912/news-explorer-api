const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config');
const NeedAuthError = require('../errors/need-auth-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new NeedAuthError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, jwtKey);
  } catch (err) {
    return next(new NeedAuthError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
