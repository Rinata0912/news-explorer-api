const jwt = require('jsonwebtoken');
const NeedAuthError = require('../errors/need-auth-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new NeedAuthError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new NeedAuthError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
