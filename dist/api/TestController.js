"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _logger = _interopRequireDefault(require("../helpers/logger"));

var _express = require("express");

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _testDatabase = _interopRequireDefault(require("../database/testDatabase"));

var _fileManager = _interopRequireDefault(require("../helpers/fileManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = _logger.default.getLogger('api');

var routes = (0, _express.Router)();
routes.use(_bodyParser.default.json());
routes.get('/', function (req, res) {
  res.status(200).json('Nothing to see here!');
});
routes.post('/', function (req, res) {
  res.status(200).json('This is all good and all, but what do you want me to do with that data.');
});
routes.get('/test-storage', function (req, res) {
  _fileManager.default.testStorageAuth().then(function (result) {
    if (result.length > 0) {
      res.status(200).send('Authenticated');
    } else {
      res.status(500).send('Unable to get Bucket List. This could be because of missing/invalid credentials');
      logger.warn('Unable to get Bucket List. This could be because of missing/invalid credentials');
    }
  }).catch(function (err) {
    logger.error(err);
    res.status(401).send(err);
  });
});
routes.get('/check-connection', function (req, res) {
  var testResults = {
    connection: true,
    database: false
  };

  _testDatabase.default.checkDatabase().then(function () {
    testResults.database = true;
    res.status(200).json(testResults);
  }).catch(function (err) {
    logger.error(err);
    testResults.err = err;
    res.status(500).json(testResults);
  });
});
var _default = routes;
exports.default = _default;
//# sourceMappingURL=TestController.js.map