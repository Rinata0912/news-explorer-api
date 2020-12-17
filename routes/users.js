const router = require('express').Router();
const getUser = require('../controllers/users');

router.get('/users/me', getUser);
