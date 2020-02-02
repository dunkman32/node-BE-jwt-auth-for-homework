var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const status = require('http-status')
const passport = require('passport');

// var logger = require('morgan');

const router = require('./routes');
const logger = require('./utils/logger');

require('./db/db');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger.expressLogger);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

require('./utils/passport')(passport);

app.use('/api', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function errorHandler(err, req, res, next) {
    let code = err.errorCode || err.statusCode || status.INTERNAL_SERVER_ERROR;
    let error = err.error || err;
    if (code === status.INTERNAL_SERVER_ERROR)
        logger.error(error);
    res.status(code).send({message: error.message || error.result_code});
});

app.get('*', (req, res) => res.redirect('/'));


module.exports = app;
