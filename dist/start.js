"use strict";

var _logger = _interopRequireDefault(require("./helpers/logger"));

var _app = _interopRequireDefault(require("./helpers/app"));

var _cluster = _interopRequireDefault(require("cluster"));

var _config = require("./config/config");

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config({
  path: _path.default.join(__dirname, '.env')
});

require('@google-cloud/debug-agent').start({
  allowExpressions: true,
  appPathRelativeToRepository: 'dist'
});

var logger = _logger.default.createLogger('worker');

var port = process.env.PORT || 3000;

var https = require('http').createServer(_app.default);

process.on('uncaughtException', function (err) {
  logger.error('Uncaught Exception => %s\n\n%s', err.message, err.stack);
});
process.on('unhandledRejection', function (reason, promise) {
  logger.error('Unhandled Rejection => %s\n\n%s', reason, promise);
});
var server = https.listen(port, function (err) {
  if (err) {
    logger.error('Connection Error => %s\n\n%s', err.message, err.stack);
  }

  if (_config.debug) {
    var host = server.address();

    if (!host || !host.address || host.address == '' || host.address == '::') {
      host.address = 'localhost';
    }

    logger.info("Server is listening on http://".concat(host.address, ":").concat(host.port, " with Worker ").concat(_cluster.default.worker.id));
  }
});
//# sourceMappingURL=start.js.map