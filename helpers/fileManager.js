const Promise = require('promise');

//const fs = require('fs');

const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
	projectId: process.env.PROJECT_ID
});

const { CLOUD_BUCKET } = process.env;

const bucket = storage.bucket(CLOUD_BUCKET);

const functions = {};

functions.testStorageAuth = function () {
	return new Promise((resolve, reject) => {
		storage.getBuckets().then(function (data) {
			const { 0: buckets } = data;

			resolve(buckets);
		})
		.catch(function (err) {
			reject(err);
		});
	});
}

module.exports = functions;