const log4js = require('log4js');
const fs = require("fs");
// const mongoUrl = require('config').get('mongo-url');
const logConfig = require('config').get('logger');

let appenders = {};
let appendersList = [];

if (process.env.NODE_ENV === 'production') {
    let logDirPath = logConfig.logDirPath;
    let logFileName = logConfig.logFileName;

    let logDir = process.cwd() + '/' + logDirPath;

    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    appenders.file = {
        type: "file",
        filename: logDirPath + '/' + logFileName
    };
    appendersList.push('file');
}

if (process.env.NODE_ENV !== 'test') {
    appenders.console = {type: "console"};
    appendersList.push('console');
}

if (Object.keys(appenders).length) {
    log4js.configure({
        appenders: appenders,
        categories: {default: {appenders: appendersList, level: 'info'}}
    });
}

const logger = log4js.getLogger();
global.logger = logger;
module.exports = logger;
module.exports.expressLogger = log4js.connectLogger(logger, {
    level: 'auto',
    format: ':method :url -> :status in :response-timems'
});
