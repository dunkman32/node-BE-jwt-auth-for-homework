const mongoose = require('mongoose');
const promise = require('promise');
const mongoUrl = require('config').get('mongo-url');
const logger = require('../utils/logger');
mongoose.Promise = promise;
mongoose.connect(mongoUrl, {useNewUrlParser: true}).then(function () {
    logger.info('Connected to DB')
}).catch(function (err) {
    logger.error(err)
});
// mongoose.set('debug', true);
module.exports = mongoose;
