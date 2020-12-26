const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-err');
const ConflictError = require('../errors/conflict-err');
const { jwtKey } = require('../config');
const {
  USER_NOT_FOUND,
  INCORRECT_DATA,
  INTERNAL_SERVICE_ERROR,
  EMAIL_ALREADY_IN_USE,
} = require('../constants/errors');
const { SUCCESSFUL_REGISTRATION } = require('../constants/messages');

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(USER_NOT_FOUND));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (
        err.message.match(/validation\sfailed/gi) || err.message.match(/failed\sfor\svalue/gi)
      ) {
        return next(new IncorrectDataError(INCORRECT_DATA));
      }
      return next(new Error(INTERNAL_SERVICE_ERROR));
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then(() => res.send({ message: SUCCESSFUL_REGISTRATION }))
        .catch((err) => {
          if (err.message.match(/validation\sfailed/gi)) {
            return next(new IncorrectDataError(INCORRECT_DATA));
          }
          if (err.name === 'MongoError' && err.code === 11000) {
            return next(new ConflictError(EMAIL_ALREADY_IN_USE));
          }

          return next(new Error(INTERNAL_SERVICE_ERROR));
        });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, jwtKey, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message.match(/validation\sfailed/gi)) {
        return next(new IncorrectDataError(INCORRECT_DATA));
      }

      return next(new NotFoundError(USER_NOT_FOUND));
    });
};
