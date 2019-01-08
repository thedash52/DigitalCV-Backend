"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _logger = _interopRequireDefault(require("../helpers/logger"));

var _express = require("express");

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _getDatabase = _interopRequireDefault(require("../database/getDatabase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = _logger.default.getLogger('api');

var routes = (0, _express.Router)();

function returnRes(res) {
  return new Promise(function (resolve) {
    resolve(res);
  });
}

routes.use(_bodyParser.default.json());
routes.get('/', function (req, res) {
  res.status(200).json('Nothing to see here!');
});
routes.post('/', function (req, res) {
  res.status(200).json('This is all good and all, but what do you want me to do with that data.');
});
routes.get('/type', function (req, res) {
  _getDatabase.default.getType().then(function (result) {
    return res.status(200).json(result);
  }).catch(function (err) {
    logger.error(err);
    res.sendStatus(500).json({
      success: 'false',
      err: err
    });
  });
});
routes.get('/basic', function (req, res) {
  _getDatabase.default.getBasic().then(function (result) {
    return Promise.all([returnRes(result), _getDatabase.default.getPhone(typeof result.results == 'undefined' ? -1 : result.results.id), _getDatabase.default.getSocial(typeof result.results == 'undefined' ? -1 : result.results.id)]);
  }).then(function (results) {
    var values = {
      basic: null,
      phone: null,
      social: null
    };

    for (var i = 0; i < results.length; i++) {
      var result = results[i];

      if (result) {
        switch (result.type) {
          case 'basic':
            values.basic = result.results;
            break;

          case 'phone':
            values.phone = result.results;
            break;

          case 'social':
            values.social = result.results;
            break;
        }
      }

      if (i == results.length - 1) {
        res.status(200).json({
          success: true,
          results: values
        });
      }
    }
  }).catch(function (err) {
    logger.error(err);
    res.status(500).json({
      success: false,
      err: err
    });
  });
});
routes.get('/skills', function (req, res) {
  _getDatabase.default.getSkills(req.headers['basicid']).then(function (results) {
    var values = [];
    var resData = results.results;

    for (var i = 0; i < resData.length; i++) {
      var data = {
        id: resData[i].id,
        user: resData[i].user,
        category: resData[i].category,
        details: resData[i].details
      };
      values.push(data);

      if (i == resData.length - 1) {
        res.status(200).json({
          success: true,
          results: values
        });
      }
    }
  }).catch(function (err) {
    logger.error(err);
    res.status(500).json({
      success: false,
      err: err
    });
  });
});
routes.get('/technology', function (req, res) {
  Promise.all([_getDatabase.default.getTechnologies(req.headers['basicid']), _getDatabase.default.getRepositories(req.headers['basicid'])]).then(function (results) {
    var values = {
      technologies: null,
      repositories: null
    };

    for (var i = 0; i < results.length; i++) {
      var result = results[i];

      if (result) {
        switch (result.type) {
          case 'technology':
            values.technologies = result.results;
            break;

          case 'repository':
            values.repositories = result.results;
            break;
        }
      }

      if (i == results.length - 1) {
        res.status(200).json({
          success: true,
          results: values
        });
      }
    }
  }).catch(function (err) {
    logger.error(err);
    res.status(500).json({
      success: false,
      err: err
    });
  });
});
routes.get('/education', function (req, res) {
  _getDatabase.default.getEducation(req.headers['basicid']).then(function (results) {
    return Promise.all([returnRes(results), _getDatabase.default.getPapers(results.results.map(function (x) {
      return x.id;
    }))]);
  }).then(function (results) {
    var values = {
      education: null,
      papers: null
    };

    for (var i = 0; i < results.length; i++) {
      var result = results[i];

      if (result) {
        switch (result.type) {
          case 'education':
            values.education = result.results;
            break;

          case 'paper':
            values.papers = result.results;
            break;
        }
      }

      if (i == results.length - 1) {
        res.status(200).json({
          success: true,
          results: values
        });
      }
    }
  }).catch(function (err) {
    logger.error(err);
    res.status(500).json({
      success: false,
      err: err
    });
  });
});
routes.get('/experience', function (req, res) {
  _getDatabase.default.getExperience(req.headers['basicid']).then(function (results) {
    var values = [];
    var resData = results.results;

    for (var i = 0; i < resData.length; i++) {
      var experience = resData[i];
      var data = {
        id: experience.id,
        user: experience.user,
        image: experience.image,
        title: experience.title,
        location: experience.location,
        description: experience.description,
        start_date: experience.start_date,
        end_date: experience.end_date,
        current: experience.current
      };
      values.push(data);

      if (i == resData.length - 1) {
        res.status(200).json({
          success: true,
          results: values
        });
      }
    }
  }).catch(function (err) {
    logger.error(err);
    res.status(500).json({
      success: false,
      err: err
    });
  });
});
routes.get('/other', function (req, res) {
  Promise.all([_getDatabase.default.getAchievements(req.headers['basicid']), _getDatabase.default.getInterests(req.headers['basicid'])]).then(function (results) {
    var values = {
      achievement: null,
      interest: null
    };

    for (var i = 0; i < results.length; i++) {
      var result = results[i];

      if (result) {
        switch (result.type) {
          case 'achievement':
            values.achievement = result.results;
            break;

          case 'interest':
            values.interest = result.results;
            break;
        }
      }

      if (i == results.length - 1) {
        res.status(200).json({
          success: true,
          results: values
        });
      }
    }
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
//# sourceMappingURL=GetController.js.map