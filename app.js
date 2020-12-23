const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const auth = require('./middlewares/auth');
const { endpoint, port } = require('./config');

const app = express();

mongoose.connect(endpoint, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), createUser);

app.use(auth);

app.use('/', router);

app.use(errorLogger);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: err.message });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`http://localhost:${port}`);
});
