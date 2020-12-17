const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-err');
const ConflictError = require('../errors/conflict-err');

module.exports.getUser = (req, res, next) => {
  User.find(req.user._id)
    .then((user) => {
      if(!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (
        err.message.match(/validation\sfailed/gi) || err.message.match(/failed\sfor\svalue/gi)
      ) {
        return next(new IncorrectDataError('Переданы некорректные данные'));
      }
      return next(new Error('Внутренняя ошибка сервиса'));
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then(() => res.send({ message: 'Вы успешно зарегистрированы!' }))
        .catch((err) => {
          if (err.message.match(/validation\sfailed/gi)) {
            return next(new IncorrectDataError('Переданы некорректные данные'));
          }
          if (err.name === 'MongoError' && err.code === 11000) {
            return next(new ConflictError('Email уже зарегистрирован'));
          }

          return next(new Error('Внутренняя ошибка сервиса'));
        });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message.match(/validation\sfailed/gi)) {
        return next(new IncorrectDataError('Переданы некорректные данные'));
      }

      return next(new NotFoundError('Пользователь не найден'));
    });
};