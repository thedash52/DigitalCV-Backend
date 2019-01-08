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

functions.verifyBasic = function (basicData) {
  if (basicData) {
    return db.select({
      col: '*',
      table: 'basic'
    }).then(function (res) {
      //eslint-disable-next-line camelcase
      basicData.show_referees = basicData.show_referees ? 1 : 0; //eslint-disable-next-line camelcase

      basicData.show_repositories = basicData.show_repositories ? 1 : 0;
      var basic = res[0];
      basic.avatar = "https://storage.googleapis.com/".concat(CLOUD_BUCKET, "/").concat(basicData.folder_id, "/").concat(basicData.avatar_img);
      basic.profile = "https://storage.googleapis.com/".concat(CLOUD_BUCKET, "/").concat(basicData.folder_id, "/").concat(basicData.profile_img);

      if (JSON.stringify(basic) !== JSON.stringify(basicData)) {
        return Promise.resolve({
          type: 'basic',
          result: false
        });
      } else {
        return Promise.resolve({
          type: 'basic',
          result: true
        });
      }
    }).catch(function (err) {
      logger.error("Database error: ".concat(err));
      return Promise.reject({
        method: 'verifyBasic',
        err: err
      });
    });
  } else {
    logger.error('Data missing. Failed data verification');
    return Promise.reject({
      method: 'verifyBasic',
      err: 'Data missing. Failed data verification'
    });
  }
};

functions.verifyPhone = function (phoneData) {
  if (phoneData) {
    return db.select({
      col: '*',
      table: 'phone'
    }).then(function (res) {
      var incorrectData = false;

      for (var r = 0; r < res.length; r++) {
        var matchingRecord = false;

        for (var p = 0; p < phoneData.length; p++) {
          var test = {
            id: phoneData[p].id,
            user: phoneData[p].user,
            type_id: phoneData[p].type.id,
            number: phoneData[p].number
          };

          if (JSON.stringify(res[r]) == JSON.stringify(test)) {
            matchingRecord = true;
          }

          if (p == phoneData.length - 1) {
            if (!matchingRecord) {
              incorrectData = true;
            }
          }
        }

        if (r == res.length - 1) {
          if (incorrectData) {
            return Promise.resolve({
              type: 'phone',
              result: false
            });
          } else {
            return Promise.resolve({
              type: 'phone',
              result: true
            });
          }
        }
      }
    }).catch(function (err) {
      logger.error("Database error: ".concat(err));
      return Promise.reject({
        method: 'verifyPhone',
        err: err
      });
    });
  } else {
    logger.error('Data missing. Failed data verification');
    return Promise.reject({
      method: 'verifyPhone',
      err: 'Data missing. Failed data verification'
    });
  }
};

functions.verifySocial = function (socialData) {
  if (socialData) {
    return db.select({
      col: '*',
      table: 'social'
    }).then(function (res) {
      var incorrectData = false;

      for (var r = 0; r < res.length; r++) {
        var matchingRecord = false;

        for (var s = 0; s < socialData.length; s++) {
          var test = {
            id: socialData[s].id,
            user: socialData[s].user,
            type_id: socialData[s].type.id,
            link: socialData[s].link
          };

          if (JSON.stringify(res[r]) == JSON.stringify(test)) {
            matchingRecord = true;
          }

          if (s == socialData.length - 1) {
            if (!matchingRecord) {
              incorrectData = true;
            }
          }
        }

        if (r == res.length - 1) {
          if (incorrectData) {
            return Promise.resolve({
              type: 'social',
              result: false
            });
          } else {
            return Promise.resolve({
              type: 'social',
              result: true
            });
          }
        }
      }
    }).catch(function (err) {
      logger.error("Database error: ".concat(err));
      return Promise.reject({
        method: 'verifySocial',
        err: err
      });
    });
  } else {
    logger.error('Data missing. Failed data verification');
    return Promise.reject({
      method: 'verifySocial',
      err: 'Data missing. Failed data verification'
    });
  }
};

functions.verifySkill = function (skillData) {
  if (skillData) {
    return db.select({
      col: '*',
      table: 'skill'
    }).then(function (res) {
      var incorrectData = false;

      for (var r = 0; r < res.length; r++) {
        var matchingRecord = false;

        for (var s = 0; s < skillData.length; s++) {
          var test = {
            id: skillData[s].id,
            user: skillData[s].user,
            category: skillData[s].category,
            details: skillData[s].details
          };

          if (JSON.stringify(res[r]) == JSON.stringify(test)) {
            matchingRecord = true;
          }

          if (s == skillData.length - 1) {
            if (!matchingRecord) {
              incorrectData = true;
            }
          }
        }

        if (r == res.length - 1) {
          if (incorrectData) {
            return Promise.resolve({
              type: 'skill',
              result: false
            });
          } else {
            return Promise.resolve({
              type: 'skill',
              result: true
            });
          }
        }
      }
    }).catch(function (err) {
      logger.error("Database error: ".concat(err));
      return Promise.reject({
        method: 'verifySkill',
        err: err
      });
    });
  } else {
    logger.error('Data missing. Failed data verification');
    return Promise.reject({
      method: 'verifySkill',
      err: 'Data missing. Failed data verification'
    });
  }
};

functions.verifyTech = function (techData) {
  if (techData) {
    return db.select({
      col: '*',
      table: 'technology'
    }).then(function (res) {
      var incorrectData = false;

      for (var r = 0; r < res.length; r++) {
        var matchingRecord = false;

        for (var t = 0; t < techData.length; t++) {
          var test = {
            id: techData[t].id,
            user: techData[t].user,
            image: techData[t].img,
            name: techData[t].name,
            detail: techData[t].detail,
            link: techData[t].link,
            category: techData[t].category
          };

          if (JSON.stringify(res[r]) == JSON.stringify(test)) {
            matchingRecord = true;
          }

          if (t == techData.length - 1) {
            if (!matchingRecord) {
              incorrectData = true;
            }
          }
        }

        if (r == res.length - 1) {
          if (incorrectData) {
            return Promise.resolve({
              type: 'technology',
              result: false
            });
          } else {
            return Promise.resolve({
              type: 'technology',
              result: true
            });
          }
        }
      }
    }).catch(function (err) {
      logger.error("Database error: ".concat(err));
      return Promise.reject({
        method: 'verifyTech',
        err: err
      });
    });
  } else {
    logger.error('Data missing. Failed data verification');
    return Promise.reject({
      method: 'verifyTech',
      err: 'Data missing. Failed data verification'
    });
  }
};

functions.verifyRepo = function (repoData) {
  if (repoData) {
    return db.select({
      col: '*',
      table: 'repository'
    }).then(function (res) {
      var incorrectData = false;

      for (var r = 0; r < res.length; r++) {
        var matchingRecord = false;

        for (var re = 0; re < repoData.length; re++) {
          var test = {
            id: repoData[re].id,
            user: repoData[re].user,
            type_id: repoData[re].type.id,
            link: repoData[re].link
          };

          if (JSON.stringify(res[r]) == JSON.stringify(test)) {
            matchingRecord = true;
          }

          if (re == repoData.length - 1) {
            if (!matchingRecord) {
              incorrectData = true;
            }
          }
        }

        if (r == res.length - 1) {
          if (incorrectData) {
            return Promise.resolve({
              type: 'repository',
              result: false
            });
          } else {
            return Promise.resolve({
              type: 'repository',
              result: true
            });
          }
        }
      }
    }).catch(function (err) {
      logger.error("Database error: ".concat(err));
      return Promise.reject({
        method: 'verifyRepo',
        err: err
      });
    });
  } else {
    logger.error('Data missing. Failed data verification');
    return Promise.reject({
      method: 'verifyRepo',
      err: 'Data missing. Failed data verification'
    });
  }
};

functions.verifyExperience = function (experienceData) {
  if (experienceData) {
    return db.select({
      col: '*',
      table: 'experience'
    }).then(function (res) {
      var incorrectData = false;

      for (var r = 0; r < res.length; r++) {
        var matchingRecord = false;

        for (var e = 0; e < experienceData.length; e++) {
          var test = {
            id: experienceData[e].id,
            user: experienceData[e].user,
            image: experienceData[e].image,
            title: experienceData[e].title,
            location: experienceData[e].location,
            description: experienceData[e].description,
            start_date: new Date(experienceData[e].start_date),
            end_date: new Date(experienceData[e].end_date),
            current: experienceData[e].current ? 1 : 0
          };

          if (JSON.stringify(res[r]) == JSON.stringify(test)) {
            matchingRecord = true;
          }

          if (e == experienceData.length - 1) {
            if (!matchingRecord) {
              incorrectData = true;
            }
          }
        }

        if (r == res.length - 1) {
          if (incorrectData) {
            return Promise.resolve({
              type: 'experience',
              result: false
            });
          } else {
            return Promise.resolve({
              type: 'experience',
              result: true
            });
          }
        }
      }
    }).catch(function (err) {
      logger.error("Database error: ".concat(err));
      return Promise.reject({
        method: 'verifyExperience',
        err: err
      });
    });
  } else {
    logger.error('Data missing. Failed data verification');
    return Promise.reject({
      method: 'verifyExperience',
      err: 'Data missing. Failed data verification'
    });
  }
};

functions.verifyEducation = function (educationData) {
  if (educationData) {
    return db.select({
      col: '*',
      table: 'education'
    }).then(function (res) {
      var incorrectData = false;

      for (var r = 0; r < res.length; r++) {
        var matchingRecord = false;

        for (var e = 0; e < educationData.length; e++) {
          var test = {
            id: educationData[e].id,
            user: educationData[e].user,
            image: educationData[e].img,
            course: educationData[e].course,
            school: educationData[e].school,
            link: educationData[e].link,
            year: educationData[e].year
          };

          if (JSON.stringify(res[r]) == JSON.stringify(test)) {
            matchingRecord = true;
          }

          if (e == educationData.length - 1) {
            if (!matchingRecord) {
              incorrectData = true;
            }
          }
        }

        if (r == res.length - 1) {
          if (incorrectData) {
            return Promise.resolve({
              type: 'education',
              result: false
            });
          } else {
            return Promise.resolve({
              type: 'education',
              result: true
            });
          }
        }
      }
    }).catch(function (err) {
      logger.error("Database error: ".concat(err));
      return Promise.reject({
        method: 'verifyEducation',
        err: err
      });
    });
  } else {
    logger.error('Data missing. Failed data verification');
    return Promise.reject({
      method: 'verifyEducation',
      err: 'Data missing. Failed data verification'
    });
  }
};

functions.verifyPapers = function (paperData) {
  if (paperData) {
    return db.select({
      col: '*',
      table: 'paper'
    }).then(function (res) {
      var incorrectData = false;

      for (var r = 0; r < res.length; r++) {
        var matchingRecord = false;

        for (var p = 0; p < paperData.length; p++) {
          var test = {
            id: paperData[p].id,
            code: paperData[p].code,
            name: paperData[p].name,
            details: paperData[p].detail,
            grade: paperData[p].grade,
            course_id: paperData[p].course
          };

          if (JSON.stringify(res[r]) == JSON.stringify(test)) {
            matchingRecord = true;
          }

          if (p == paperData.length - 1) {
            if (!matchingRecord) {
              incorrectData = true;
            }
          }
        }

        if (r == res.length - 1) {
          if (incorrectData) {
            return Promise.resolve({
              type: 'paper',
              result: false
            });
          } else {
            return Promise.resolve({
              type: 'paper',
              result: true
            });
          }
        }
      }
    }).catch(function (err) {
      logger.error("Database error: ".concat(err));
      return Promise.reject({
        method: 'verifyPapers',
        err: err
      });
    });
  } else {
    logger.error('Data missing. Failed data verification');
    return Promise.reject({
      method: 'verifyPapers',
      err: 'Data missing. Failed data verification'
    });
  }
};

functions.verifyAchievements = function (achievementData) {
  if (achievementData) {
    return db.select({
      col: '*',
      table: 'achievement'
    }).then(function (res) {
      var incorrectData = false;

      for (var r = 0; r < res.length; r++) {
        var matchingRecord = false;

        for (var a = 0; a < achievementData.length; a++) {
          var test = {
            id: achievementData[a].id,
            user: achievementData[a].user,
            name: achievementData[a].name,
            where: achievementData[a].where,
            what_why: achievementData[a].whatWhy
          };

          if (JSON.stringify(res[r]) == JSON.stringify(test)) {
            matchingRecord = true;
          }

          if (a == achievementData.length - 1) {
            if (!matchingRecord) {
              incorrectData = true;
            }
          }
        }

        if (r == res.length - 1) {
          if (incorrectData) {
            return Promise.resolve({
              type: 'achievement',
              result: false
            });
          } else {
            return Promise.resolve({
              type: 'achievement',
              result: true
            });
          }
        }
      }
    }).catch(function (err) {
      logger.error("Database error: ".concat(err));
      return Promise.reject({
        method: 'verifyAchievements',
        err: err
      });
    });
  } else {
    logger.error('Data missing. Failed data verification');
    return Promise.reject({
      method: 'verifyAchievements',
      err: 'Data missing. Failed data verification'
    });
  }
};

functions.verifyInterests = function (interestData) {
  if (interestData) {
    return db.select({
      col: '*',
      table: 'interest'
    }).then(function (res) {
      var incorrectData = false;

      for (var r = 0; r < res.length; r++) {
        var matchingRecord = false;

        for (var i = 0; i < interestData.length; i++) {
          var test = {
            id: interestData[i].id,
            user: interestData[i].user,
            image: interestData[i].img,
            name: interestData[i].name
          };

          if (JSON.stringify(res[r]) == JSON.stringify(test)) {
            matchingRecord = true;
          }

          if (i == interestData.length - 1) {
            if (!matchingRecord) {
              incorrectData = true;
            }
          }
        }

        if (r == res.length - 1) {
          if (incorrectData) {
            return Promise.resolve({
              type: 'interest',
              result: false
            });
          } else {
            return Promise.resolve({
              type: 'interest',
              result: true
            });
          }
        }
      }
    }).catch(function (err) {
      logger.error("Database error: ".concat(err));
      return Promise.reject({
        method: 'verifyInterests',
        err: err
      });
    });
  } else {
    logger.error('Data missing. Failed data verification');
    return Promise.reject({
      method: 'verifyInterests',
      err: 'Data missing. Failed data verification'
    });
  }
};

var _default = functions;
exports.default = _default;
//# sourceMappingURL=verifyDatabase.js.map