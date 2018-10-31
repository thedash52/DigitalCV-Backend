require('dotenv').config();

import { fork, on, setupMaster } from 'cluster';
import { createLogger } from './helpers/logger';

const logger = createLogger('master');

process.on('uncaughtException', function(err) {
    logger.error('Uncaught Exception => %s\n\n%s', err.message, err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection => %s\n\n%s', reason, promise);
});

setupMaster({
    exec: './helpers/workers.js'
});

var cpu = require('os').cpus().length;

for (let i = 0; i < cpu; i++) {
    fork();
}

on('exit', function (worker) {
    logger.warn(`Worker ${worker.id} died. Restarting Worker`);
    fork();
});
