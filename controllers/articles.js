const article = require('../models/article');
const Atricle = require('../models/article');

module.exports.getSavedArticles = (req, res, next) => {
  Atricle.find({})
    .then((articles) => {
      if(!articles) {
        return res.send({ message: 'нет сохраненных статей'});
      }
      return res.send({ data: articles });
    })
    .catch((err) => {
      return res.send({ message: 'ошибка' });
    });
};

module.exports.createArticle = (req, res, next) => {
  const { keyword, title, text, data, source, link, image } = req.body;

  Atricle.create({ keyword, title, text, data, source, link, image })
    .then((article) => {
      return res.send({ data: article });
    })
    .catch((err) => {
      return res.send({ message: err });
    });
};

module.exports.removeArticle = (req, res, next) => {
  Atricle.findByIdAndRemove(req.params.articleId)
    .then((article) => {
      return res.send({ data: article });
    })
    .catch((err) => {
      res.send({ message: err });
    });
};
