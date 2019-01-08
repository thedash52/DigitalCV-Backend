"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _logger = _interopRequireDefault(require("../helpers/logger"));

var _express = require("express");

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _verifyDatabase = _interopRequireDefault(require("../database/verifyDatabase"));

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
routes.post('/basic', function (req, res) {
  Promise.all([_verifyDatabase.default.verifyBasic(req.body.basic.basic), _verifyDatabase.default.verifyPhone(req.body.basic.phone), _verifyDatabase.default.verifySocial(req.body.basic.social)]).then(function (results) {
    var values = {
      basic: null,
      phone: null,
      social: null
    };

    for (var i = 0; i < results.length; i++) {
      var result = results[i];

      switch (result.type) {
        case 'basic':
          values.basic = result.result;
          break;

        case 'phone':
          values.phone = result.result;
          break;

        case 'social':
          values.social = result.result;
          break;
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
routes.post('/skill', function (req, res) {
  _verifyDatabase.default.verifySkill(req.body.skill).then(function (results) {
    res.status(200).json({
      success: true,
      results: results.result
    });
  }).catch(function (err) {
    logger.error(err);
    res.status(500).json({
      success: false,
      err: err
    });
  });
});
routes.post('/tech', function (req, res) {
  Promise.all([_verifyDatabase.default.verifyTech(req.body.tech.technologies), _verifyDatabase.default.verifyRepo(req.body.tech.repositories)]).then(function (results) {
    var values = {
      technology: null,
      repository: null
    };

    for (var i = 0; i < results.length; i++) {
      var result = results[i];

      switch (result.type) {
        case 'technology':
          values.technology = result.result;
          break;

        case 'repository':
          values.repository = result.result;
          break;
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
routes.post('/experience', function (req, res) {
  _verifyDatabase.default.verifyExperience(req.body.experience).then(function (results) {
    res.status(200).json({
      success: true,
      results: results.result
    });
  }).catch(function (err) {
    logger.error(err);
    res.status(500).json({
      success: false,
      err: err
    });
  });
});
routes.post('/education', function (req, res) {
  Promise.all([_verifyDatabase.default.verifyEducation(req.body.education.education), _verifyDatabase.default.verifyPapers(req.body.education.papers)]).then(function (results) {
    var values = {
      education: null,
      paper: null
    };

    for (var i = 0; i < results.length; i++) {
      var result = results[i];

      switch (result.type) {
        case 'education':
          values.education = result.result;
          break;

        case 'paper':
          values.paper = result.result;
          break;
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
routes.post('/other', function (req, res) {
  Promise.all([_verifyDatabase.default.verifyAchievements(req.body.other.achievement), _verifyDatabase.default.verifyInterests(req.body.other.interest)]).then(function (results) {
    var values = {
      achievement: null,
      interest: null
    };

    for (var i = 0; i < results.length; i++) {
      var result = results[i];

      switch (result.type) {
        case 'achievement':
          values.achievement = result.result;
          break;

        case 'interest':
          values.interest = result.result;
          break;
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
//# sourceMappingURL=VerifyController.js.map