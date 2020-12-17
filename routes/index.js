const router = require('express').Router();

const articlesRoute = require('./articles');
const usersRoutes = require('./users');

router.use('/', articlesRoute);
router.use('/', usersRoutes);

module.exports = router;
