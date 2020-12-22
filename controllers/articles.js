const Atricle = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getSavedArticles = (req, res, next) => {
  Atricle.find({})
    .then((articles) => {
      if (!articles) {
        return next(new NotFoundError('нет сохраненных статей'));
      }
      return res.send({ data: articles });
    })
    .catch((err) => {
      if (err.message.match(/validation\sfailed/ig)) {
        return next(new IncorrectDataError('Переданы некорректные данные'));
      }
      return next(new Error('Внутренняя ошибка сервиса'));
    });
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  Atricle.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => res.send({ data: article }))
    .catch((err) => {
      if (err.message.match(/validation\sfailed/ig)) {
        return next(new IncorrectDataError('Переданы некорректные данные'));
      }
      return next(new Error('Внутренняя ошибка сервиса'));
    });
};

module.exports.removeArticle = (req, res, next) => {
  const userData = req.user;

  Atricle.findById(req.params.articleId).select('+owner')
    .then((article) => {
      if (!article) {
        return next(new NotFoundError('такой статьи не существует'));
      }

      if (article.owner !== userData._id) {
        return next(new ForbiddenError('Отказано в доступе'));
      }

      return Atricle.findByIdAndRemove(req.params.articleId)
        .then((deletedArticle) => res.send({ data: deletedArticle }));
    })
    .catch((err) => {
      if (err.message.match(/validation\sfailed/ig) || err.message.match(/failed\sfor\svalue/ig)) {
        return next(new IncorrectDataError('Переданы некорректные данные'));
      }
      return next(new Error('Внутренняя ошибка сервиса'));
    });
};
