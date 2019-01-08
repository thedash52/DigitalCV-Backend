"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = require("../config/config");

var _authDatabase = _interopRequireDefault(require("../database/authDatabase"));

var _passport = _interopRequireDefault(require("passport"));

var _passportJwt = _interopRequireDefault(require("passport-jwt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Strategy = _passportJwt.default.Strategy,
    extract = _passportJwt.default.ExtractJwt;

var Auth =
/*#__PURE__*/
function () {
  function Auth() {
    _classCallCheck(this, Auth);

    var params = {};

    if (process.env.NODE_ENV === 'production' || !_config.debug) {
      params = {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: extract.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false
      };
    } else {
      params = {
        secretOrKey: _config.jwtSecret,
        jwtFromRequest: extract.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: true
      };
    }

    var strategy = new Strategy(params, function (payload, done) {
      _authDatabase.default.authenticate(payload.id, payload.username).then(function (user) {
        return done(null, user);
      }).catch(function (err) {
        if (err) {
          return done(new Error(err), false);
        } else {
          return done(null, false);
        }
      });
    });

    _passport.default.use(strategy);
  }

  _createClass(Auth, [{
    key: "initialize",
    value: function initialize() {
      return _passport.default.initialize();
    }
  }, {
    key: "authenticate",
    value: function authenticate() {
      return _passport.default.authenticate('jwt', {
        session: false
      });
    }
  }]);

  return Auth;
}();

exports.default = Auth;
//# sourceMappingURL=auth.js.map