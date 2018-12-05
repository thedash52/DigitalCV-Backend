import Logger from '../helpers/logger';
import { Router } from 'express';
import bodyParser from 'body-parser';
import db from '../database/testDatabase';
import fm from '../helpers/fileManager';

const logger = Logger.getLogger('api');
const routes = Router();

routes.use(bodyParser.json());

routes.get('/', function (req, res) {
	res.status(200).json('Nothing to see here!');
});

routes.post('/', function (req, res) {
	res.status(200).json('This is all good and all, but what do you want me to do with that data.');
});

routes.get('/test-storage', function (req, res) {
	fm.testStorageAuth().then((result) => {
			if (result.length > 0) {
				res.status(200).send('Authenticated');
			} else {
				res.status(500).send('Unable to get Bucket List. This could be because of missing/invalid credentials');
				logger.warn('Unable to get Bucket List. This could be because of missing/invalid credentials');
			}
		})
		.catch((err) => {
			res.status(401).send(err);
			logger.error(err);
		});
});

routes.get('/check-connection', function (req, res) {
    const testResults = {
        connection: true,
        database: false,
        err: ''
    };

    db.checkDatabase().then((result) => {
        testResults.database = true;
        testResults.err = result;
        res.status(200).json(testResults);
    }).catch((err) => {
        testResults.err = err;
        res.status(200).json(testResults);
    });
});

export default routes;