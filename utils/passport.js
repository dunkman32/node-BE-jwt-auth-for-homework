const config = require('config');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const status = require('http-status');
const User = require('../db/user');
const auth = require('./auth');
const security = require('./security');


module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id).exec().then(function(user) {
            return done(null, user);
        }).catch(function(err) {
            done(err);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    passport.use('local', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    }, function(req, email, password, done) {
        console.log(email);
        User.find({
            email: email.toLowerCase()
        }).lean().exec()
            .then(docs => {
                if (docs.length === 1) {
                    return docs[0];
                }

                throw {
                    error: new Error('Invalid email or password'),
                    errorCode: status.BAD_REQUEST
                };
            }).then(user => {
            if (security.checkPassword(password, user.password)) {
                return user;
            }

            throw {
                error: new Error('Invalid email or password'),
                errorCode: status.BAD_REQUEST
            };
        }).then(user => {
            return auth.login(req, user);
        }).then(result => done(null, result)).catch(done)
    }));

    // =========================================================================
    // JWT AUTH ================================================================
    // =========================================================================

    const options = {
        jwtFromRequest: ExtractJwt.fromExtractors([auth.cookieExtractor,ExtractJwt.fromHeader("token")]),
        secretOrKey: config.get('token.secret')
    };

    passport.use(new JwtStrategy(options, function(payload, done) {
        User.findOne({
            email: payload.email.toLowerCase()
        }).lean().exec()
            .then(user => {
                if (!user) return done(null, false);
                done(null, user);
            })
            .catch(done);
    }));
};
