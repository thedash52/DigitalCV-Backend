const logManager = require('../helpers/logger');
const logger = logManager.getLogger('api');
const routes = require('express').Router();
const bodyParser = require('body-parser');
const fm = require('../helpers/fileManager');

const config = require('../config/config');

routes.use(bodyParser.json());

routes.get('/', function (req, res) {
	res.status(200).json("Nothing to see here!");
});

routes.post('/', function (req, res) {
	res.status(200).json("This is all good and all, but what do you want me to do with that data.");
});

routes.get('/test-storage', function (req, res) {
	fm.testStorageAuth().then((result) => {
			if (result.length > 0) {
				res.status(200).send("Authenticated");
			} else {
				res.status(500).send("Unable to get Bucket List. This could be because of missing/invalid credentials");
				logger.warn("Unable to get Bucket List. This could be because of missing/invalid credentials");
			}
		})
		.catch((err) => {
			res.status(401).send(err);
			logger.error(err);
		});
});

module.exports = routes;