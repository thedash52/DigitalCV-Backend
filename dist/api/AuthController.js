"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = require("../config/config");

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _express = require("express");

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _authDatabase = _interopRequireDefault(require("../database/authDatabase"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var auth = new _auth.default();
var routes = (0, _express.Router)();
routes.use(_bodyParser.default.json());
routes.get('/', function (req, res) {
  res.status(200).json('Nothing to see here!');
});
routes.post('/', function (req, res) {
  res.status(200).json('This is all good and all, but what do you want me to do with that data.');
});
routes.post('/login', function (req, res) {
  var _req$body = req.body,
      username = _req$body.username,
      password = _req$body.password;

  if (username && password) {
    _authDatabase.default.login(username, password).then(function (user) {
      if (user) {
        var payload = {
          id: user.results.id,
          username: username
        };
        var options = {
          expiresIn: '3h',
          issuer: 'TheDashCoder - DigitalCV',
          subject: username,
          audience: 'http://thedashcoder.online'
        };

        var token = _jsonwebtoken.default.sign(payload, _config.debug ? _config.jwtSecret : process.env.JWT_SECRET, options);

        res.json({
          success: true,
          token: token
        });
      }
    }).catch(function (err) {
      res.status(401).json({
        success: false,
        result: err
      });
    });
  } else {
    res.sendStatus(401).json({
      success: false,
      result: 'Missing Username/Password.'
    });
  }
});
routes.get('/check-login', auth.authenticate(), function (req, res) {
  res.status(200).json(true);
});
var _default = routes;
exports.default = _default;
//# sourceMappingURL=AuthController.js.map