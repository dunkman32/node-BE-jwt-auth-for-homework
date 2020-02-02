const express = require('express');
const passport = require('passport');
const randomstring = require("randomstring");
const User = require('../db/user');
const config = require('config');
const jwt = require('jsonwebtoken');
const userInteractor = require('../interactors/userInteractor');
const security = require('../utils/security');
const tryCatch = require('../utils/tryCatch');


const router = express.Router();

function getUrl() {
    if (!process.NODE_ENV || process.NODE_ENV === 'development') {
        return 'http://localhost:4200/';
    }

    return '/';
}

router.post('/login', passport.authenticate(
    'local',
    {session: false}),
    tryCatch((req, res) => {
        const user = {
            token: req.user,
        };
        return res.send(user);
    }));

router.post('/register', async (req, res, next) => {
    try {
        await userInteractor.registerClient(req.body);
        res.send();
    } catch (error) {
        next(error);
    }
});

router.post('/logout', function (req, res, next) {
    req.logout();
});

module.exports = router;
