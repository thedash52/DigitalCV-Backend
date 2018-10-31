const winston = require('winston');
const path = require('path');
const config = require('../config').local;
const loggers = new winston.Container();

const logPath = path.join(__dirname, '..', 'logs');

function Logger () {
    this.init = function () {
        const defaultLog = {
            level: config.debug ? 'debug' : config.log_level,
            format: winston.format.combine(
                winston.format.label({label: 'Default'}),
                winston.format.splat(),
                winston.format.timestamp(),
                winston.format.printf((info) => `${info.timestamp} - ${info.level}: (${info.label}) ${info.message}`)
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: path.join(logPath, 'full.log'),
                    level: 'info',
                    maxsize: 10*1024*1024,
                    maxFiles: 5,
                    tailable: true
                }),
                new winston.transports.File({
                    filename: path.join(logPath, 'error.log'),
                    level: 'error',
                    maxsize: 10*1024*1024,
                    maxFiles: 5,
                    tailable: true
                })
            ],
            exitOnError: false
        };

        return loggers.add('default', defaultLog);
    }

    this.getLogger = function(label) {
        if (!label) {
            return loggers.get('default');
        } else if (loggers.has(label)) {
            return loggers.get(label);
        } else {
            return false;
        }
    }

    this.createLogger = function(label) {
        const logger = {
            level: config.debug ? 'debug' : config.log_level,
            format: winston.format.combine(
                winston.format.label({label: label}),
                winston.format.splat(),
                winston.format.timestamp(),
                winston.format.printf(info => `${info.timestamp} - ${info.level}: (${info.label}) ${info.message}`)
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename:path.join(logPath, 'full-' + label + '.log'),
                    level: 'info',
                    maxsize: 10*1024*1024,
                    maxFiles: 5,
                    tailable: true
                }),
                new winston.transports.File({
                    filename: path.join(logPath, 'error-' + label + '.log'),
                    level: 'error',
                    maxsize: 10*1024*1024,
                    maxFiles: 5,
                    tailable: true
                })
            ],
            exitOnError: false
        };

        return loggers.add(label, logger);
    }

    this.removeLogger = function (label, all) {
        all = all ? all : false;

        if (label && !all) {
            loggers.close(label);
        } else if (all) {
            loggers.close();
        }
    }
}

module.exports = new Logger;
