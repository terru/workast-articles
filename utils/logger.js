/**
 * Wrapper class for Log4js logger
 * @use log4js
 * @usage var logger = new Logger();
 *        logger.msg("String to log");
 *        msg = warn,fatal,debug,trace,error,info
 */

var log4js = require('log4js');
var config = require('../config');

log4js.configure(__dirname + '/../config/' + config.Log4js.confPath, {});

/**
 * Logger
 * @param type log type (by defect is settend in the application logger: workast-articles)
 * @param level log level to use (by defect setted as 'INFO')
 */
var Logger = function (type, level) {
    if (type == null) {
        var aLog = log4js.getLogger('middleware');
    } else {
        var aLog = log4js.getLogger(type);
    }

    if (level == null) {
        aLog.level = 'INFO';
    } else {
        aLog.level = level;
    }


    this.info = function (string) {
        aLog.info(string);
    };

    this.error = function (string) {
        aLog.error(string);
    };

    this.trace = function (string) {
        aLog.trace(string);
    };

    this.debug = function (string) {
        aLog.debug(string);
    };

    this.warn = function (string) {
        aLog.warn(string);
    };

    this.fatal = function (string) {
        aLog.fatal(string)
    };

};

module.exports = Logger;
