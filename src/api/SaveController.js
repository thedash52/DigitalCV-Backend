import Auth from '../helpers/auth';
import Logger from '../helpers/logger';
import { Router } from 'express';
import bodyParser from 'body-parser';
import db from '../database/saveDatabase';

const auth = new Auth();

const logger = Logger.getLogger('api');
const routes = Router();

routes.use(bodyParser.json());

routes.get('/', function (req, res) {
	res.status(200).json('Nothing to see here!');
});

routes.post('/', function (req, res) {
	res.status(200).json('This is all good and all, but what do you want me to do with that data.');
});

routes.post('/edit', auth.authenticate(), function (req, res) {
    res.status(501);

    return;

    const data = req.body.edit;
    db.saveBasic(data.basic).then(result => Promise.all([
            db.savePhone(result, data.phone),
            db.saveSocial(result, data.social),
            db.saveSkill(result, data.skill),
            db.saveTechnology(result, data.technology),
            db.saveRepository(result, data.repository),
            db.saveExperience(result, data.experience),
            db.saveEducation(result, data.education),
            db.saveAchievement(result, data.achievement),
            db.saveInterest(result, data.interest)
        ])).then(() => {
        res.status(200).json({
            success: true
        });
    }).catch((err) => {
        logger.error(err);
        res.status(500).json({
            success: false,
            err: err
        });
    });
});

export default routes;