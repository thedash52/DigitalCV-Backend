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

functions.checkDatabase = function () {
  var tables = ['achievement', 'basic', 'education', 'experience', 'interest', 'paper', 'phone', 'repository', 'skill', 'social', 'technology', 'type', 'user']; //eslint-disable-next-line max-statements

  return db.showTables().then(function (res) {
    var numTables = 0;
    var migrationTableRegex = new RegExp('(.*)mysql_migrations(.*)');

    for (var i = 0; i < res.length; i++) {
      var tableName = res[i]['Tables_in_digitalcv'];

      if (!migrationTableRegex.test(tableName)) {
        var foundTable = false;

        for (var r = 0; r < tables.length; r++) {
          if (tableName == tables[r]) {
            foundTable = true;
          }

          if (r == tables.length - 1) {
            //eslint-disable-next-line max-depth
            if (foundTable) {
              numTables += 1;
            }
          }
        }
      }

      if (i == res.length - 1) {
        if (numTables != tables.length) {
          var missingTables = [];

          for (var t = 0; t < tables.length; t++) {
            var tableFound = false; //eslint-disable-next-line max-depth

            for (var n = 0; n < res.length; n++) {
              var testingTable = res[n]['Tables_in_digitalcv']; //eslint-disable-next-line max-depth

              if (tables[t] == testingTable) {
                tableFound = true;
              } //eslint-disable-next-line max-depth


              if (n == res.length - 1) {
                //eslint-disable-next-line max-depth
                if (!tableFound) {
                  missingTables.push(res[n]);
                }
              }
            } //eslint-disable-next-line max-depth


            if (t == tables.length - 1) {
              logger.error("Database setup incorrectly. Missing the following tables: ".concat(missingTables));
              return Promise.reject({
                method: 'checkDatabase',
                err: "Database setup incorrectly. Missing the following tables: ".concat(missingTables)
              });
            }
          }
        } else {
          return Promise.resolve({
            type: 'databaseConnection',
            results: true
          });
        }
      }
    }
  }).catch(function (err) {
    logger.error("Database Error: ".concat(err));
    return Promise.reject({
      method: 'checkDatabase',
      err: err
    });
  });
};

var _default = functions;
exports.default = _default;
//# sourceMappingURL=testDatabase.js.map