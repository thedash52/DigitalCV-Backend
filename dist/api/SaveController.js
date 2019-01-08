"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _logger = _interopRequireDefault(require("../helpers/logger"));

var _express = require("express");

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _saveDatabase = _interopRequireDefault(require("../database/saveDatabase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var auth = new _auth.default();

var logger = _logger.default.getLogger('api');

var routes = (0, _express.Router)();
routes.use(_bodyParser.default.json());
routes.get('/', function (req, res) {
  res.status(200).json('Nothing to see here!');
});
routes.post('/', function (req, res) {
  res.status(200).json('This is all good and all, but what do you want me to do with that data.');
});
routes.post('/edit', auth.authenticate(), function (req, res) {
  res.status(501);
  return;
  var data = req.body.edit;

  _saveDatabase.default.saveBasic(data.basic).then(function (result) {
    return Promise.all([_saveDatabase.default.savePhone(result, data.phone), _saveDatabase.default.saveSocial(result, data.social), _saveDatabase.default.saveSkill(result, data.skill), _saveDatabase.default.saveTechnology(result, data.technology), _saveDatabase.default.saveRepository(result, data.repository), _saveDatabase.default.saveExperience(result, data.experience), _saveDatabase.default.saveEducation(result, data.education), _saveDatabase.default.saveAchievement(result, data.achievement), _saveDatabase.default.saveInterest(result, data.interest)]);
  }).then(function () {
    res.status(200).json({
      success: true
    });
  }).catch(function (err) {
    logger.error(err);
    res.status(500).json({
      success: false,
      err: err
    });
  });
});
var _default = routes;
exports.default = _default;
//# sourceMappingURL=SaveController.js.map