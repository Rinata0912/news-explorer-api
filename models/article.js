const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/i.test(v);
      },
      message: 'невалидная ссылка',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/i.test(v);
      },
      message: 'невалидная ссылка',
    },
  },
  owner: {
    type: String,
    required: true,
    select: false,
  },
  id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('article', articleSchema);
