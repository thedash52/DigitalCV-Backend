"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _logger = _interopRequireDefault(require("../helpers/logger"));

var _database = _interopRequireDefault(require("../helpers/database"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CLOUD_BUCKET = process.env.CLOUD_BUCKET;

var logger = _logger.default.getLogger();

var db = new _database.default();
var functions = {};

functions.getType = function () {
  return db.select({
    col: '*',
    table: 'type'
  }).then(function (res) {
    return Promise.resolve({
      type: 'type',
      results: res
    });
  }).catch(function (err) {
    logger.error("Database error: ".concat(err));
    return Promise.reject({
      method: 'getType',
      err: err
    });
  });
};

functions.getBasic = function () {
  return db.select({
    col: '*',
    table: 'basic',
    limit: '1'
  }).then(function (res) {
    var basicData = res[0];

    if (typeof basicData != 'undefined' && basicData.folder_id && basicData.avatar_img && basicData.profile_img) {
      basicData.avatar = "https://storage.googleapis.com/".concat(CLOUD_BUCKET, "/").concat(basicData.folder_id, "/").concat(basicData.avatar_img);
      basicData.profile = "https://storage.googleapis.com/".concat(CLOUD_BUCKET, "/").concat(basicData.folder_id, "/").concat(basicData.profile_img);
      return Promise.resolve({
        type: 'basic',
        results: basicData
      });
    } else {
      return Promise.resolve({
        type: 'basic',
        results: basicData
      });
    }
  }).catch(function (err) {
    logger.error("Database error: ".concat(err));
    return Promise.reject({
      method: 'getBasic',
      err: err
    });
  });
};

functions.getPhone = function (id) {
  if (id > -1) {
    return db.select({
      col: '*',
      table: 'phone',
      conditions: "user = ".concat(id)
    }).then(function (res) {
      if (res.length > 0) {
        return db.select({
          col: '*',
          table: 'type',
          conditions: "id IN (".concat(res.map(function (data) {
            return data.type_id;
          }), ")")
        }).then(function (typeRes) {
          var phoneNumbers = [];

          for (var p = 0; p < res.length; p++) {
            for (var t = 0; t < typeRes.length; t++) {
              if (res[p].type_id == typeRes[t].id) {
                var phoneDetails = {
                  id: res[p].id,
                  user: res[p].user,
                  type: {
                    id: typeRes[t].id,
                    short: typeRes[t].short,
                    long: typeRes[t].long
                  },
                  number: res[p].number
                };
                phoneNumbers.push(phoneDetails);
              }
            }

            if (phoneNumbers.length == res.length) {
              return Promise.resolve({
                type: 'phone',
                results: phoneNumbers
              });
            }
          }
        }).catch(function (err) {
          logger.error("Database error: ".concat(err));
          return Promise.reject({
            method: 'getPhone',
            err: err
          });
        });
      } else {
        return Promise.resolve({
          type: 'phone',
          results: res
        });
      }
    }).catch(function (err) {
      logger.error("Database error: ".concat(err));
      return Promise.reject({
        method: 'getPhone',
        err: err
      });
    });
  } else {
    return Promise.resolve({
      type: 'phone',
      results: null
    });
  }
};

functions.getSocial = function (id) {
  if (id > -1) {
    return db.select({
      col: '*',
      table: 'social',
      conditions: "user = ".concat(id)
    }).then(function (res) {
      if (res.length > 0) {
        return db.select({
          col: '*',
          table: 'type',
          conditions: "id IN (".concat(res.map(function (data) {
            return data.type_id;
          }), ")")
        }).then(function (typeRes) {
          var socialData = [];

          for (var s = 0; s < res.length; s++) {
            for (var t = 0; t < typeRes.length; t++) {
              if (res[s].type_id == typeRes[t].id) {
                var socialDetails = {
                  id: res[s].id,
                  user: res[s].user,
                  type: {
                    id: typeRes[t].id,
                    short: typeRes[t].short,
                    long: typeRes[t].long
                  },
                  link: res[s].link
                };
                socialData.push(socialDetails);
              }
            }

            if (res.length == socialData.length) {
              return Promise.resolve({
                type: 'social',
                results: socialData
              });
            }
          }
        }).catch(function (err) {
          logger.error("Database error: ".concat(err));
          return Promise.reject({
            method: 'getSocial',
            err: err
          });
        });
      } else {
        return Promise.resolve({
          type: 'social',
          results: res
        });
      }
    }).catch(function (err) {
      logger.error("Database error: ".concat(err));
      return Promise.reject({
        method: 'getSocial',
        err: err
      });
    });
  } else {
    return Promise.resolve({
      type: 'phone',
      results: null
    });
  }
};

functions.getSkills = function (id) {
  if (id > -1) {
    return db.select({
      col: '*',
      table: 'skill',
      conditions: "user = ".concat(id)
    }).then(function (res) {
      return Promise.resolve({
        type: 'skills',
        results: res
      });
    }).catch(function (err) {
      logger.error("Database error: ".concat(err));
      return Promise.reject({
        method: 'getSkills',
        err: err
      });
    });
  } else {
    return Promise.resolve({
      type: 'skills',
      results: null
    });
  }
};

functions.getTechnologies = function (id) {
  if (id > -1) {
    return db.select({
      col: '*',
      table: 'technology',
      conditions: "user = ".concat(id)
    }).then(function (res) {
      var values = [];

      for (var r = 0; r < res.length; r++) {
        var value = {
          id: res[r].id,
          user: res[r].user,
          img: res[r].image,
          name: res[r].name,
          detail: res[r].detail,
          link: res[r].link,
          category: res[r].category
        };
        values.push(value);

        if (values.length == res.length) {
          return Promise.resolve({
            type: 'technology',
            results: values
          });
        }
      }
    }).catch(function (err) {
      logger.error("Database error: ".concat(err));
      return Promise.reject({
        method: 'getTechnologies',
        err: err
      });
    });
  } else {
    return Promise.resolve({
      type: 'technology',
      results: null
    });
  }
};

functions.getRepositories = function (id) {
  if (id > -1) {
    return db.select({
      col: '*',
      table: 'repository',
      conditions: "user = ".concat(id)
    }).then(function (res) {
      if (res.length > 0) {
        return db.select({
          col: '*',
          table: 'type',
          conditions: "id IN (".concat(res.map(function (data) {
            return data.type_id;
          }), ")")
        }).then(function (typeRes) {
          var repositoryData = [];

          for (var r = 0; r < res.length; r++) {
            for (var t = 0; t < typeRes.length; t++) {
              if (res[r].type_id == typeRes[t].id) {
                var repoDetails = {
                  id: res[r].id,
                  user: res[r].user,
                  type: {
                    id: typeRes[t].id,
                    short: typeRes[t].short,
                    long: typeRes[t].long
                  },
                  link: res[r].link
                };
                repositoryData.push(repoDetails);
              }
            }

            if (res.length == repositoryData.length) {
              return Promise.resolve({
                type: 'repository',
                results: repositoryData
              });
            }
          }
        }).catch(function (err) {
          logger.error("Database error: ".concat(err));
          return Promise.reject({
            method: 'getRepositories',
            err: err
          });
        });
      } else {
        return Promise.resolve({
          type: 'repository',
          results: res
        });
      }
    }).catch(function (err) {
      logger.error("Database error: ".concat(err));
      return Promise.reject({
        method: 'getRepositories',
        err: err
      });
    });
  } else {
    return Promise.resolve({
      type: 'repository',
      results: null
    });
  }
};

functions.getExperience = function (id) {
  if (id > -1) {
    return db.select({
      col: '*',
      table: 'experience',
      conditions: "user = ".concat(id)
    }).then(function (res) {
      return Promise.resolve({
        type: 'experience',
        results: res
      });
    }).catch(function (err) {
      logger.error("Database error: ".concat(err));
      return Promise.reject({
        method: 'getExperience',
        err: err
      });
    });
  } else {
    return Promise.resolve({
      type: 'experience',
      results: null
    });
  }
};

functions.getEducation = function (id) {
  if (id > -1) {
    return db.select({
      col: '*',
      table: 'education',
      conditions: "user = ".concat(id)
    }).then(function (res) {
      var values = [];

      for (var r = 0; r < res.length; r++) {
        var data = {
          id: res[r].id,
          user: res[r].user,
          img: res[r].image,
          course: res[r].course,
          school: res[r].school,
          link: res[r].link,
          year: res[r].year
        };
        values.push(data);

        if (values.length == res.length) {
          return Promise.resolve({
            type: 'education',
            results: values
          });
        }
      }
    }).catch(function (err) {
      logger.error("Database error: ".concat(err));
      return Promise.reject({
        method: 'getEducation',
        err: err
      });
    });
  } else {
    return Promise.resolve({
      type: 'education',
      results: null
    });
  }
};

functions.getPapers = function (id) {
  if (id.length) {
    return db.select({
      col: '*',
      table: 'paper',
      conditions: "course_id IN (".concat(id, ")")
    }).then(function (res) {
      var values = [];

      for (var r = 0; r < res.length; r++) {
        var data = {
          id: res[r].id,
          code: res[r].code,
          name: res[r].name,
          detail: res[r].details,
          grade: res[r].grade,
          course: res[r].course_id
        };
        values.push(data);

        if (values.length == res.length) {
          return Promise.resolve({
            type: 'paper',
            results: values
          });
        }
      }
    }).catch(function (err) {
      logger.error("Database error: ".concat(err));
      return Promise.reject({
        method: 'getPapers',
        err: err
      });
    });
  } else {
    return Promise.resolve({
      type: 'paper',
      results: null
    });
  }
};

functions.getAchievements = function (id) {
  if (id > -1) {
    return db.select({
      col: '*',
      table: 'achievement',
      conditions: "user = ".concat(id)
    }).then(function (res) {
      var values = [];

      for (var r = 0; r < res.length; r++) {
        var data = {
          id: res[r].id,
          user: res[r].user,
          name: res[r].name,
          where: res[r].where,
          whatWhy: res[r].what_why
        };
        values.push(data);

        if (values.length == res.length) {
          return Promise.resolve({
            type: 'achievement',
            results: values
          });
        }
      }
    }).catch(function (err) {
      logger.error("Database error: ".concat(err));
      return Promise.reject({
        method: 'getAchievements',
        err: err
      });
    });
  } else {
    return Promise.resolve({
      type: 'achievement',
      results: null
    });
  }
};

functions.getInterests = function (id) {
  if (id > -1) {
    return db.select({
      col: '*',
      table: 'interest',
      conditions: "user = ".concat(id)
    }).then(function (res) {
      var values = [];

      for (var r = 0; r < res.length; r++) {
        var data = {
          id: res[r].id,
          user: res[r].user,
          img: res[r].image,
          name: res[r].name
        };
        values.push(data);

        if (values.length == res.length) {
          return Promise.resolve({
            type: 'interest',
            results: values
          });
        }
      }
    }).catch(function (err) {
      logger.error("Database error: ".concat(err));
      return Promise.reject({
        method: 'getInterests',
        err: err
      });
    });
  } else {
    return Promise.resolve({
      type: 'interest',
      results: null
    });
  }
};

var _default = functions;
exports.default = _default;
//# sourceMappingURL=getDatabase.js.map