const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const  { getSavedArticles, createArticle, removeArticle } = require('../controllers/articles');

router.get('/articles', getSavedArticles);
router.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required(),
    image: Joi.string().required(),
  }).unknown(true),
}), createArticle);
router.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24),
  }).unknown(true),
}), removeArticle);

module.exports = router;