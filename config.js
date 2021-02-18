require('dotenv').config();

const {
  NODE_ENV,
  JWT_SECRET,
  ENDPOINT,
  PORT,
} = process.env;
const isProduction = NODE_ENV === 'production';

const jwtKey = isProduction ? JWT_SECRET : 'some-secret-key';
const endpoint = isProduction ? ENDPOINT : 'mongodb://localhost:27017/news';
const port = PORT || 4000;

module.exports = {
  jwtKey,
  endpoint,
  port,
};
