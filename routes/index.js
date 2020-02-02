const express = require('express');
const user = require('./users');
const auth = require('./auth-router');

const router = express();

router.use('/user', user);
router.use('/auth', auth);
module.exports = router;
