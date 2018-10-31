const logManager = require('../helpers/logger');
const logger = logManager.getLogger();
const db = require('../helpers/database');

const functions = {};

functions.test = function () {
    db.select({ col: '*', table: 'test' }).then((res) => {
        logger.info(res);
    });
}

module.exports = functions;
