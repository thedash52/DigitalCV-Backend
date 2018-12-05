import Logger from './logger';
import app from './app';
import cluster from 'cluster';
import { debug } from '../config/config';

const logger = Logger.createLogger('worker');

const port = process.env.PORT || 3000;

const https = require('http').createServer(app);

process.on('uncaughtException', function(err) {
    logger.error('Uncaught Exception => %s\n\n%s', err.message, err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection => %s\n\n%s', reason, promise);
});

const server = https.listen(port, (err) => {
    if (err) {
        logger.error('Connection Error => %s\n\n%s', err.message, err.stack);
    }

    if (debug) {
        var host = server.address();

        if (!host || (!host.address || host.address == '' || host.address == '::')) {
            host.address = 'localhost';
        }

        logger.info(`Server is listening on http://${host.address}:${host.port} with Worker ${cluster.worker.id}`);
    }
});
