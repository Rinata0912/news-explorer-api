const { VALIDATION_ERROR, INTERNAL_SERVICE_ERROR } = require('../constants/errors');

const errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message } = err;

  if (message === 'celebrate request validation failed') {
    statusCode = 400;
    message = VALIDATION_ERROR;
  } else if (statusCode === 500) {
    message = INTERNAL_SERVICE_ERROR;
  }

  res.status(statusCode).send({ message });
  next();
};

module.exports = errorHandler;
