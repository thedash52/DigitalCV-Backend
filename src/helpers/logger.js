import { debug, logLevel } from '../config/config';
import path from 'path';
import winston from 'winston';

const loggers = new winston.Container();

const logPath = path.join(__dirname, '..', 'logs');

export default class Logger {
    static init() {
        const defaultLog = {
            level: debug ? 'debug' : logLevel,
            format: winston.format.combine(winston.format.label({
                label: 'Default'
            }), winston.format.splat(), winston.format.timestamp(), winston.format.printf((info) => `${info.timestamp} - ${info.level}: (${info.label}) ${JSON.stringify(info.message)}`)),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: path.join(logPath, 'full.log'),
                    level: 'info',
                    maxsize: 10 * 1024 * 1024,
                    maxFiles: 5,
                    tailable: true
                }),
                new winston.transports.File({
                    filename: path.join(logPath, 'error.log'),
                    level: 'error',
                    maxsize: 10 * 1024 * 1024,
                    maxFiles: 5,
                    tailable: true
                })
            ],
            exitOnError: false
        };

        return loggers.add('default', defaultLog);
    }

    static getLogger(label) {
        if (!label) {
            return loggers.get('default');
        } else if (loggers.has(label)) {
            return loggers.get(label);
        } else {
            return false;
        }
    }

    static createLogger(label) {
        const logger = {
            level: debug ? 'debug' : logLevel,
            format: winston.format.combine(winston.format.label({
                label: label
            }), winston.format.splat(), winston.format.timestamp(), winston.format.printf(info => `${info.timestamp} - ${info.level}: (${info.label}) ${info.message}`)),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: path.join(logPath, 'full-' + label + '.log'),
                    level: 'info',
                    maxsize: 10 * 1024 * 1024,
                    maxFiles: 5,
                    tailable: true
                }),
                new winston.transports.File({
                    filename: path.join(logPath, 'error-' + label + '.log'),
                    level: 'error',
                    maxsize: 10 * 1024 * 1024,
                    maxFiles: 5,
                    tailable: true
                })
            ],
            exitOnError: false
        };

        return loggers.add(label, logger);
    }

    static removeLogger(label, all) {
        all = all ? all : false;

        if (label && !all) {
            loggers.close(label);
        } else if (all) {
            loggers.close();
        }
    }
}