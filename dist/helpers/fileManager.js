"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _storage = require("@google-cloud/storage");

var _buffer = _interopRequireDefault(require("buffer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storage = new _storage.Storage({
  projectId: process.env.PROJECT_ID
});
var CLOUD_BUCKET = process.env.CLOUD_BUCKET;
var bucket = storage.bucket(CLOUD_BUCKET);
var functions = {};

functions.testStorageAuth = function () {
  return new Promise(function (resolve, reject) {
    storage.getBuckets().then(function (data) {
      var buckets = data[0];
      resolve(buckets);
    }).catch(function (err) {
      reject(err);
    });
  });
};

functions.saveBasicImages = function (id, avatar_image, profile_image) {
  return new Promise(function (resolve, reject) {
    var avatarImage = avatar_image.replace(/^data:image\/\w+;base64,/, '');
    var profileImage = profile_image.replace(/^data:image\/\w+;base64,/, '');
    var folderDir = "/backend/".concat(id, "/images/basic");
    var avatarFile = bucket.file("".concat(folderDir, "/avatar_img.jpg"));
    var profileFile = bucket.file("".concat(folderDir, "/profile_img.jpg"));
    var options = {
      metadata: {
        contentType: 'image/jpeg'
      },
      resumable: false
    };
    var avatarStream = avatarFile.createWriteStream(options);
    var profileStream = profileFile.createWriteStream(options);
    avatarStream.on('error', function (err) {
      reject({
        method: 'saveBasicImages',
        err: err
      });
    });
    profileStream.on('error', function (err) {
      reject({
        method: 'saveBasicImages',
        err: err
      });
    });
    profileStream.on('finish', function () {
      profileFile.makePublic().then(function () {
        resolve({
          avatar: "/images/basic/avatar_img.jpg",
          profile: "/images/basic/profile_img.jpg}"
        });
      });
    });
    avatarStream.on('finish', function () {
      avatarFile.makePublic().then(function () {
        profileStream.end(_buffer.default.from(profileImage, 'base64'));
      });
    });
    avatarStream.end(_buffer.default.from(avatarImage, 'base64'));
  });
};

var _default = functions;
exports.default = _default;
//# sourceMappingURL=fileManager.js.map