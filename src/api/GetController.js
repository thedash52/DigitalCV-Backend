import Logger from '../helpers/logger';
import { Router } from 'express';
import bodyParser from 'body-parser';
import db from '../database/getDatabase';

const logger = Logger.getLogger('api');
const routes = Router();

function returnRes (res) {
    return new Promise((resolve) => {
        resolve(res);
    });
}

routes.use(bodyParser.json());

routes.get('/', function (req, res) {
	res.status(200).json('Nothing to see here!');
});

routes.post('/', function (req, res) {
	res.status(200).json('This is all good and all, but what do you want me to do with that data.');
});

routes.get('/type', function (req, res) {
    db.getType().then((result) => res.status(200).json(result)).catch((err) => {
        logger.error(err);
        res.sendStatus(500).json({
            success: 'false',
            err: err
        });
    });
});

routes.get('/basic', function (req, res) {
    db.getBasic().then((result) => Promise.all([
        returnRes(result),
        db.getPhone(typeof (result.results) == 'undefined' ? -1 : result.results.id),
        db.getSocial(typeof (result.results) == 'undefined' ? -1 : result.results.id)
    ])).then((results) => {
        const values = {
            basic: null,
            phone: null,
            social: null
        };

        for (let i = 0; i < results.length; i++) {
            const result = results[i];

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

routes.get('/skills', function (req, res) {
    db.getSkills(req.headers['basicid']).then((results) => {
        const values = [];
        const resData = results.results;

        for (let i = 0; i < resData.length; i++) {
            const data = {
                id: resData[i].id,
                user: resData[i].user,
                category: resData[i].category,
                details: resData[i].details
            }

            values.push(data);

            if (i == (resData.length - 1)) {
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

routes.get('/technology', function (req, res) {
    Promise.all([
        db.getTechnologies(req.headers['basicid']),
        db.getRepositories(req.headers['basicid'])
    ]).then((results) => {
        const values = {
            technologies: null,
            repositories: null
        };

        for (let i = 0; i < results.length; i++) {
            const result = results[i];

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

routes.get('/education', function (req, res) {
    db.getEducation(req.headers['basicid']).then((results) => Promise.all([
        returnRes(results),
        db.getPapers(results.results.map((x) => x.id))
    ])).then((results) => {
        const values = {
            education: null,
            papers: null
        };

        for (let i = 0; i < results.length; i++) {
            const result = results[i];

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

routes.get('/experience', function (req, res) {
    db.getExperience(req.headers['basicid']).then((results) => {
        const values = [];
        const resData = results.results;

        for (let i = 0; i < resData.length; i++) {
            const experience = resData[i];
            const data = {
                id: experience.id,
                user: experience.user,
                image: experience.image,
                title: experience.title,
                location: experience.location,
                description: experience.description,
                start_date: experience.start_date,
                end_date: experience.end_date,
                current: experience.current
            }

            values.push(data);

            if (i == (resData.length - 1)) {
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

routes.get('/other', function (req, res) {
    Promise.all([
        db.getAchievements(req.headers['basicid']),
        db.getInterests(req.headers['basicid'])
    ]).then((results) => {
        const values = {
            achievement: null,
            interest: null
        };

        for (let i = 0; i < results.length; i++) {
            const result = results[i];

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