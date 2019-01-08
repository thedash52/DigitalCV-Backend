import Logger from '../helpers/logger';
import { Router } from 'express';
import bodyParser from 'body-parser';
import db from '../database/verifyDatabase';

const logger = Logger.getLogger('api');
const routes = Router();

routes.use(bodyParser.json());

routes.get('/', function (req, res) {
	res.status(200).json('Nothing to see here!');
});

routes.post('/', function (req, res) {
	res.status(200).json('This is all good and all, but what do you want me to do with that data.');
});

routes.post('/basic', function (req, res) {
    Promise.all([
        db.verifyBasic(req.body.basic.basic),
        db.verifyPhone(req.body.basic.phone),
        db.verifySocial(req.body.basic.social)
    ]).then((results) => {
        const values = {
            basic: null,
            phone: null,
            social: null
        };

        for (let i = 0; i < results.length; i++) {
            const result = results[i];

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

            if (i == (results.length - 1)) {
                res.status(200).json({
                    success: true,
                    results: values
                });
            }
        }
    }).catch((err) => {
        logger.error(err);
        res.status(500).json({
            success: false,
            err: err
        });
    });
});

routes.post('/skill', function (req, res) {
    db.verifySkill(req.body.skill).then((results) => {
        res.status(200).json({
            success: true,
            results: results.result
        });
    }).catch((err) => {
        logger.error(err);
        res.status(500).json({
            success: false,
            err: err
        });
    });
});

routes.post('/tech', function (req, res) {
    Promise.all([
        db.verifyTech(req.body.tech.technologies),
        db.verifyRepo(req.body.tech.repositories)
    ]).then((results) => {
        const values = {
            technology: null,
            repository: null
        }

        for (let i = 0; i < results.length; i++) {
            const result = results[i];

            switch (result.type) {
                case 'technology':
                    values.technology = result.result;
                    break;
                case 'repository':
                    values.repository = result.result;
                    break;
            }

            if (i == (results.length - 1)) {
                res.status(200).json({
                    success: true,
                    results: values
                });
            }
        }
    }).catch((err) => {
        logger.error(err);
        res.status(500).json({
            success: false,
            err: err
        });
    });
});

routes.post('/experience', function (req, res) {
    db.verifyExperience(req.body.experience).then((results) => {
        res.status(200).json({
            success: true,
            results: results.result
        });
    }).catch((err) => {
        logger.error(err);
        res.status(500).json({
            success: false,
            err: err
        });
    });
});

routes.post('/education', function (req, res) {
    Promise.all([
        db.verifyEducation(req.body.education.education),
        db.verifyPapers(req.body.education.papers)
    ]).then((results) => {
        const values = {
            education: null,
            paper: null
        }

        for (let i = 0; i < results.length; i++) {
            const result = results[i];

            switch (result.type) {
                case 'education':
                    values.education = result.result;
                    break;
                case 'paper':
                    values.paper = result.result;
                    break;
            }

            if (i == (results.length - 1)) {
                res.status(200).json({
                    success: true,
                    results: values
                });
            }
        }
    }).catch((err) => {
        logger.error(err);
        res.status(500).json({
            success: false,
            err: err
        });
    });
});

routes.post('/other', function (req, res) {
    Promise.all([
        db.verifyAchievements(req.body.other.achievement),
        db.verifyInterests(req.body.other.interest)
    ]).then((results) => {
        const values = {
            achievement: null,
            interest: null
        }

        for (let i = 0; i < results.length; i++) {
            const result = results[i];

            switch (result.type) {
                case 'achievement':
                    values.achievement = result.result;
                    break;
                case 'interest':
                    values.interest = result.result;
                    break;
            }

            if (i == (results.length - 1)) {
                res.status(200).json({
                    success: true,
                    results: values
                });
            }
        }
    }).catch((err) => {
        logger.error(err);
        res.status(500).json({
            success: false,
            err: err
        });
    });
});

export default routes;