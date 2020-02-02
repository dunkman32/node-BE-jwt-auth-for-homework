'use strict';
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('config');
const User = require('../db/user');
const ExtractJwt = require('passport-jwt').ExtractJwt;

async function login(req, user, bind) {
    let payload = _.pick(user, ['_id', 'email']);
    // let payload = user;
    const userElement = await User.findOne({
        user: user._id
    }).lean().exec();

    let token = jwt.sign(
        payload,
        config.get('token.secret'), {
            expiresIn: config.get('token.timeout')
        }
    );

    return token;
}

function cookieExtractor(req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};

function optionalJwtAuth(req, res, next) {
    if (cookieExtractor(req) || ExtractJwt.fromHeader("token")(req) ) {
        passport.authenticate('jwt')(req, res, next);

        return
    }

    next();
}

module.exports = {
    login,
    cookieExtractor,
    optionalJwtAuth
};
