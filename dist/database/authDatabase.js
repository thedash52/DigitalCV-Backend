"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _logger = _interopRequireDefault(require("../helpers/logger"));

var _database = _interopRequireDefault(require("../helpers/database"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = _logger.default.getLogger();

var db = new _database.default();
var functions = {};

functions.login = function (username, password) {
  return db.select({
    col: '*',
    table: 'user'
  }).then(function (res) {
    for (var i = 0; i < res.length; i++) {
      if (res[i].username === username && res[i].password === password) {
        return Promise.resolve({
          type: 'user',
          results: res[i]
        });
      }

      if (i == res.length - 1) {
        return Promise.reject({
          method: 'login',
          err: 'Invalid Username and/or Password.'
        });
      }
    }
  }).catch(function (err) {
    logger.error("Database error: ".concat(err));
    return Promise.reject({
      method: 'login',
      err: err
    });
  });
};

functions.authenticate = function (id, username) {
  return db.select({
    col: '*',
    table: 'user',
    conditions: "id = '".concat(id, "' AND username = '").concat(username, "'"),
    limit: '1'
  }).then(function (res) {
    if (res.length > 0) {
      return Promise.resolve({
        type: 'basic',
        results: res[0]
      });
    } else {
      return Promise.reject({
        method: 'authenticate',
        err: 'Error Authenticating User. Please try again.'
      });
    }
  }).catch(function (err) {
    logger.error("Database Error: ".concat(err));
    return Promise.reject({
      method: 'authenticate',
      err: err
    });
  });
};

var _default = functions;
exports.default = _default;
//# sourceMappingURL=authDatabase.js.map