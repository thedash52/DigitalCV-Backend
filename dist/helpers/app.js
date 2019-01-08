"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = require("../config/config");

var _auth = _interopRequireDefault(require("./auth"));

var _AuthController = _interopRequireDefault(require("../api/AuthController"));

var _GetController = _interopRequireDefault(require("../api/GetController"));

var _SaveController = _interopRequireDefault(require("../api/SaveController"));

var _TestController = _interopRequireDefault(require("../api/TestController"));

var _VerifyController = _interopRequireDefault(require("../api/VerifyController"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var auth = new _auth.default();
var whiteList = _config.debug ? _config.corsWhiteListDebug : _config.corsWhiteListProd;
var corsOptions = {
  origin: function origin(_origin, cb) {
    if (_origin === undefined || whiteList.indexOf(_origin) !== -1 || whiteList.indexOf('*') !== -1) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};
var app = (0, _express.default)();
app.set('trust proxy', true);
app.use((0, _cors.default)(corsOptions));
app.use(_bodyParser.default.json({
  limit: '50mb'
}));
app.use(auth.initialize());
app.get('/', function (req, res) {
  res.status(200).json("Nothing to see here!");
});
app.post('/', function (req, res) {
  res.status(200).json("This is all good and all, but what do you want me to do with that data.");
});
app.use('/test', _TestController.default);
app.use('/auth', _AuthController.default);
app.use('/get', _GetController.default);
app.use('/verify', _VerifyController.default);
app.use('/save', _SaveController.default);
var _default = app;
exports.default = _default;
//# sourceMappingURL=app.js.map