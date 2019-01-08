"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _logger = _interopRequireDefault(require("../helpers/logger"));

var _database = _interopRequireDefault(require("../helpers/database"));

var _fileManager = _interopRequireDefault(require("../helpers/fileManager"));

var _v = _interopRequireDefault(require("uuid/v4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = _logger.default.getLogger();

var db = new _database.default();
var functions = {};

functions.saveBasic = function (basicData) {
  var folderId;

  if (basicData.folderId && basicData.folderId !== null && typeof basicData.folderId != 'undefined') {
    var currentId = basicData.folderId;
    folderId = currentId;
  } else {
    folderId = (0, _v.default)();
  }

  return _fileManager.default.saveBasicImages(folderId, basicData.avatar, basicData.profile).then(function (paths) {
    var pendingFunction;
    var sql;
    var data = [folderId, paths.avatar, paths.profile, basicData.name, basicData.address_1, basicData.address_2, basicData.address_3, basicData.city, basicData.summary, basicData.show_referees ? 1 : 0, basicData.show_repositories ? 1 : 0];

    if (basicData.id && basicData.id !== null && typeof basicData.id != 'undefined') {
      var col = ['folder_id', 'avatar_img', 'profile_img', 'name', 'address_1', 'address_2', 'address_3', 'city', 'summary', 'show_referees', 'show_repositories'];
      pendingFunction = db.update;
      sql = {
        table: 'basic',
        col: col,
        data: data,
        conditions: "id = ".concat(basicData.id)
      };
    } else {
      pendingFunction = db.insert;
      sql = {
        table: 'basic',
        col: 'folder_id, avatar_img, profile_img, name, address_1, address_2, address_3, city, summary, show_referees, show_repositories',
        data: data
      };
    }

    return pendingFunction(sql).then(function (res) {
      if (res.insertId > 0) {
        return Promise.resolve(res.insertId);
      } else {
        return Promise.resolve(basicData.id);
      }
    }).catch(function (err) {
      logger.error("Database Error: ".concat(err));
      return Promise.reject({
        method: 'saveBasic',
        err: err
      });
    });
  }).catch(function (err) {
    logger.error("File Error: ".concat(err));
    return Promise.reject({
      method: 'saveBasic',
      err: err
    });
  });
};

var _default = functions;
exports.default = _default;
//# sourceMappingURL=saveDatabase.js.map