"use strict";

var _logger = _interopRequireDefault(require("./helpers/logger"));

var _cluster = _interopRequireDefault(require("cluster"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var logger = _logger.default.init();

process.on('uncaughtException', function (err) {
  logger.error('Uncaught Exception => %s\n\n%s', err.message, err.stack);
});
process.on('unhandledRejection', function (reason, promise) {
  logger.error('Unhandled Rejection => %s\n\n%s', reason, promise);
});

_cluster.default.setupMaster({
  exec: './helpers/workers.js'
});

var cpu = require('os').cpus().length;

for (var i = 0; i < cpu; i++) {
  _cluster.default.fork();
}

_cluster.default.on('exit', function (worker) {
  logger.warn("Worker ".concat(worker.id, " died. Restarting Worker"));

  _cluster.default.fork();
});
//# sourceMappingURL=index.js.map