const Atricle = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-err');
const ForbiddenError = require('../errors/forbidden-err');
const {
  SAVED_ARTICLES_NOT_FOUND,
  ARTICLE_NOT_FOUND,
  ACCESS_DENIED,
  INCORRECT_DATA,
  INTERNAL_SERVICE_ERROR,
} = require('../constants/errors');

module.exports.getSavedArticles = (req, res, next) => {
  Atricle.find({})
    .then((articles) => {
      if (!articles) {
        return next(new NotFoundError(SAVED_ARTICLES_NOT_FOUND));
      }
      return res.send({ data: articles });
    })
    .catch((err) => {
      if (err.message.match(/validation\sfailed/ig)) {
        return next(new IncorrectDataError(INCORRECT_DATA));
      }
      return next(new Error(INTERNAL_SERVICE_ERROR));
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
        return next(new IncorrectDataError(INCORRECT_DATA));
      }
      return next(new Error(INTERNAL_SERVICE_ERROR));
    });
};

module.exports.removeArticle = (req, res, next) => {
  const userData = req.user;

  Atricle.findById(req.params.articleId).select('+owner')
    .then((article) => {
      if (!article) {
        return next(new NotFoundError(ARTICLE_NOT_FOUND));
      }

      if (article.owner !== userData._id) {
        return next(new ForbiddenError(ACCESS_DENIED));
      }

      return Atricle.findByIdAndRemove(req.params.articleId)
        .then((deletedArticle) => res.send({ data: deletedArticle }));
    })
    .catch((err) => {
      if (err.message.match(/validation\sfailed/ig) || err.message.match(/failed\sfor\svalue/ig)) {
        return next(new IncorrectDataError(INCORRECT_DATA));
      }
      return next(new Error(INTERNAL_SERVICE_ERROR));
    });
};
