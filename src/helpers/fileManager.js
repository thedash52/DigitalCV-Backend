import { Storage } from '@google-cloud/storage';
import buffer from 'buffer';

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

functions.saveBasicImages = function (id, avatar_image, profile_image) {
	return new Promise((resolve, reject) => {
		const avatarImage = avatar_image.replace(/^data:image\/\w+;base64,/, '');
		const profileImage = profile_image.replace(/^data:image\/\w+;base64,/, '');

		const folderDir = `/backend/${id}/images/basic`;
		
		const avatarFile = bucket.file(`${folderDir}/avatar_img.jpg`);
		const profileFile = bucket.file(`${folderDir}/profile_img.jpg`);

		const options = {
			metadata: {
				contentType: 'image/jpeg'
			},
			resumable: false
		};

		const avatarStream = avatarFile.createWriteStream(options);
		const profileStream = profileFile.createWriteStream(options);

		avatarStream.on('error', (err) => {
			reject({
				method: 'saveBasicImages',
				err: err
			});
		});

		profileStream.on('error', (err) => {
			reject({
				method: 'saveBasicImages',
				err: err
			});
		});

		profileStream.on('finish', () => {
			profileFile.makePublic().then(() => {
				resolve({
					avatar: `/images/basic/avatar_img.jpg`,
					profile: `/images/basic/profile_img.jpg}`
				});
			});
		});

		avatarStream.on('finish', () => {
			avatarFile.makePublic().then(() => {
				profileStream.end(buffer.from(profileImage, 'base64'));
			});
		});

		avatarStream.end(buffer.from(avatarImage, 'base64'));
	});
}

export default functions;