"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = require("../config/config");

var _mysql = _interopRequireDefault(require("mysql"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DB =
/*#__PURE__*/
function () {
  function DB() {
    _classCallCheck(this, DB);

    var options = {};

    if (process.env.NODE_ENV === 'production' || !_config.debug) {
      options = {
        connectionLimit: 100,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST
      };
    } else {
      options = _config.databaseDebug;
    }

    this.pool = _mysql.default.createPool(options);
  }

  _createClass(DB, [{
    key: "select",
    value: function select(_ref) {
      var _this = this;

      var col = _ref.col,
          table = _ref.table,
          join = _ref.join,
          conditions = _ref.conditions,
          groupby = _ref.groupby,
          having = _ref.having,
          orderby = _ref.orderby,
          limit = _ref.limit;
      return new Promise(function (resolve, reject) {
        conditions = conditions ? 'WHERE ' + conditions : '';
        groupby = groupby ? 'GROUP BY ' + groupby : '';
        having = having ? 'HAVING ' + having : '';
        orderby = orderby ? 'ORDER BY ' + orderby : '';
        join = join ? join.type + ' JOIN ' + join.table + ' ON ' + join.link : '';
        limit = limit ? 'LIMIT ' + limit : '';

        _this.pool.getConnection(function (err, conn) {
          if (err) {
            reject(err);
          }

          conn.query("SELECT ".concat(col, " FROM ").concat(table, " ").concat(join, " ").concat(conditions, " ").concat(groupby, " ").concat(having, " ").concat(orderby, " ").concat(limit), function (errorResult, result) {
            conn.release();

            if (!errorResult) {
              resolve(result);
            } else {
              reject(errorResult);
            }
          });
          conn.once('error', function (error) {
            conn.release();
            reject(error);
          });
        });
      });
    }
  }, {
    key: "insert",
    value: function insert(_ref2) {
      var _this2 = this;

      var table = _ref2.table,
          col = _ref2.col,
          data = _ref2.data;
      return new Promise(function (resolve, reject) {
        _this2.pool.getConnection(function (err, conn) {
          if (err) {
            reject(err);
          }

          conn.query("INSERT INTO '".concat(table, "' (").concat(col, ") VALUES (").concat(data, ")"), function (errorResult, result) {
            conn.release();

            if (!errorResult) {
              resolve(result);
            } else {
              reject(errorResult);
            }
          });
          conn.once('error', function (error) {
            conn.release();
            reject(error);
          });
        });
      });
    }
  }, {
    key: "bulkInsert",
    value: function bulkInsert(_ref3) {
      var _this3 = this;

      var table = _ref3.table,
          col = _ref3.col,
          data = _ref3.data;
      return new Promise(function (resolve, reject) {
        _this3.pool.getConnection(function (err, conn) {
          if (err) {
            reject(err);
          }

          conn.query("INSERT INTO '".concat(table, "' (").concat(col, ") VALUES ?"), [data], function (errorResult, result) {
            conn.release();

            if (!errorResult) {
              resolve(result);
            } else {
              reject(errorResult);
            }
          });
          conn.once('error', function (error) {
            conn.release();
            reject(error);
          });
        });
      });
    }
  }, {
    key: "update",
    value: function update(_ref4) {
      var _this4 = this;

      var table = _ref4.table,
          col = _ref4.col,
          data = _ref4.data,
          conditions = _ref4.conditions;
      return new Promise(function (resolve, reject) {
        if (conditions) {
          reject('Attempting to update all records. Attempt being seen as hack. Attempt Blocked.');
        } else {
          if (data.length !== col.length) {
            reject('Invalid Query. Number of values to be updated does not match number of columns to be updated.');
          } else {
            var updateData;

            for (var i = 0; i < data.length; i++) {
              if (i == data.length - 1) {
                updateData += col[i] + ' = ' + data[i] + ', ';
              } else {
                updateData += col[i] + ' = ' + data[i];
              }
            }

            _this4.pool.getConnection(function (err, conn) {
              if (err) {
                reject(err);
              }

              conn.query("UPDATE ".concat(table, " SET ").concat(updateData, " WHERE ").concat(conditions), function (errorResult, result) {
                conn.release();

                if (!errorResult) {
                  resolve(result);
                } else {
                  reject(errorResult);
                }
              });
              conn.once('error', function (error) {
                conn.release();
                reject(error);
              });
            });
          }
        }
      });
    }
  }, {
    key: "delete",
    value: function _delete(_ref5) {
      var _this5 = this;

      var table = _ref5.table,
          conditions = _ref5.conditions,
          values = _ref5.values;
      return new Promise(function (resolve, reject) {
        if (conditions) {
          reject('Attempting to delete all records. Attempt being seen as hack. Now blocking attempt.');
        } else {
          _this5.pool.getConnection(function (err, conn) {
            if (err) {
              reject(err);
            }

            if (values) {
              conn.query("DELETE FROM '".concat(table, "' WHERE ").concat(conditions), values, function (errorResult, result) {
                conn.release();

                if (!errorResult) {
                  resolve(result);
                } else {
                  reject(errorResult);
                }
              });
            } else {
              conn.query("DELETE FROM '".concat(table, "' WHERE ").concat(conditions), function (errorResult, result) {
                conn.release();

                if (!errorResult) {
                  resolve(result);
                } else {
                  reject(errorResult);
                }
              });
            }

            conn.once('error', function (error) {
              conn.release();
              reject(error);
            });
          });
        }
      });
    }
  }, {
    key: "showTables",
    value: function showTables() {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        _this6.pool.getConnection(function (err, conn) {
          if (err) {
            return reject(err);
          }

          conn.query("SHOW TABLES", function (errorResult, result) {
            conn.release();

            if (!errorResult) {
              if (result.length > 1) {
                return resolve(result);
              } else {
                return reject("Database has not been setup. Please run migrations.");
              }
            } else {
              reject(err);
            }
          });
          conn.once('error', function (error) {
            return reject(error);
          });
        });
      });
    }
  }]);

  return DB;
}();

exports.default = DB;
//# sourceMappingURL=database.js.map