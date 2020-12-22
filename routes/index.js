const router = require('express').Router();

const articlesRoute = require('./articles');
const usersRoutes = require('./users');
const errorRoute = require('./error');

router.use('/', articlesRoute);
router.use('/', usersRoutes);
router.use('*', errorRoute);

module.exports = router;
