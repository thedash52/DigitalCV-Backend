require('dotenv').config({debug: true});

import Logger from './helpers/logger';
import cluster from 'cluster';

const logger = Logger.init();

process.on('uncaughtException', function(err) {
    logger.error('Uncaught Exception => %s\n\n%s', err.message, err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection => %s\n\n%s', reason, promise);
});

cluster.setupMaster({
    exec: './helpers/workers.js'
});

var cpu = require('os').cpus().length;

for (let i = 0; i < cpu; i++) {
    cluster.fork();
}

cluster.on('exit', function (worker) {
    logger.warn(`Worker ${worker.id} died. Restarting Worker`);
    cluster.fork();
});
