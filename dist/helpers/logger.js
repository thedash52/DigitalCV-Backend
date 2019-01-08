"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = require("../config/config");

var _loggingWinston = require("@google-cloud/logging-winston");

var _winston = _interopRequireDefault(require("winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var loggers = new _winston.default.Container();
var loggingWinston = new _loggingWinston.LoggingWinston(); //const logPath = path.join(__dirname, '..', 'logs');

var Logger =
/*#__PURE__*/
function () {
  function Logger() {
    _classCallCheck(this, Logger);
  }

  _createClass(Logger, null, [{
    key: "init",
    value: function init() {
      var defaultLog = {
        level: _config.debug ? 'debug' : _config.logLevel,
        format: _winston.default.format.combine(_winston.default.format.label({
          label: 'Default'
        }), _winston.default.format.splat(), _winston.default.format.timestamp(), _winston.default.format.printf(function (info) {
          return "".concat(info.timestamp, " - ").concat(info.level, ": (").concat(info.label, ") ").concat(JSON.stringify(info.message));
        })),
        transports: [new _winston.default.transports.Console(), loggingWinston],
        exitOnError: false
      };
      return loggers.add('default', defaultLog);
    }
  }, {
    key: "getLogger",
    value: function getLogger(label) {
      if (!label) {
        return loggers.get('default');
      } else if (loggers.has(label)) {
        return loggers.get(label);
      } else {
        return false;
      }
    }
  }, {
    key: "createLogger",
    value: function createLogger(label) {
      var logger = {
        level: _config.debug ? 'debug' : _config.logLevel,
        format: _winston.default.format.combine(_winston.default.format.label({
          label: label
        }), _winston.default.format.splat(), _winston.default.format.timestamp(), _winston.default.format.printf(function (info) {
          return "".concat(info.timestamp, " - ").concat(info.level, ": (").concat(info.label, ") ").concat(info.message);
        })),
        transports: [new _winston.default.transports.Console(), loggingWinston],
        exitOnError: false
      };
      return loggers.add(label, logger);
    }
  }, {
    key: "removeLogger",
    value: function removeLogger(label, all) {
      all = all ? all : false;

      if (label && !all) {
        loggers.close(label);
      } else if (all) {
        loggers.close();
      }
    }
  }]);

  return Logger;
}();

exports.default = Logger;
//# sourceMappingURL=logger.js.map