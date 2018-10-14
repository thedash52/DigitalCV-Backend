const fs = require('fs');
const mkdir = require('mkdirp');

const { Storage} = require('@google-cloud/storage');
const storage = new Storage({
	projectId: process.env.PROJECT_ID
});

const CLOUD_BUCKET = process.env.CLOUD_BUCKET;

const functions = {};

functions.testStorageAuth = function () {
	return new Promise ((resolve, reject) => {
		storage.getBuckets().then(function (data) {
			const buckets = data[0];

			resolve(buckets);
		})
		.catch(function (err) {
			reject(err);
		});
	});
}

functions.saveBasicImages = function saveBasicImages(id, avatar_image, profile_image) {
    return new Promise((resolve, reject) => {
        const avatarImage = avatar_image.replace(/^data:image\/\w+;base64,/, '');
        const profileImage = profile_image.replace(/^data:image\/\w+;base64,/, '');

        const folderPath = __dirname + "/files/" + id + "/images/basic";

        mkdir(folderPath, (err) => {
            if (err) {
                return reject({
                    method: "saveBasicImages",
                    err: err
                });
            }

            fs.writeFile(folderPath + "/avatar_img.jpg", avatarImage, {
                encoding: 'base64'
            }, (err) => {
                if (err) {
                    return reject({
                        method: "saveBasicImages",
                        err: err
                    });
                }

                fs.writeFile(folderPath + "/profile_img.jpg", profileImage, {
                    encoding: 'base64'
                }, (err) => {
                    if (err) {
                        return reject({
                            method: "saveBasicImages",
                            err: err
                        });
                    }

                    return resolve({
                        avatar: "/images/basic/avatar_img.jpg",
                        profile: "/images/basic/profile_img.jpg"
                    });
                });
            });
        });
    });
};

functions.getBasicImages = function getBasicImages(folderId, avatar_image, profile_image) {
    return new Promise((resolve, reject) => {
        const avatar = "data:image/jpeg;base64,";
        const profile = "data:image/jpeg;base64,";

        fs.readFile(__dirname + "/files/" + folderId + avatar_image, {
            encoding: 'base64'
        }, (err, avatarData) => {
            if (err) {
                return reject({
                    method: "getBasicImages",
                    err: err
                });
            }

            avatar += avatarData;

            fs.readFile(__dirname + "/files/" + folderId + profile_image, {
                encoding: 'base64'
            }, (err, profileData) => {
                if (err) {
                    return reject({
                        method: "getBasicImages",
                        err: err
                    });
                }

                profile += profileData;

                return resolve({
                    avatar: avatar,
                    profile: profile
                });
            })
        });

    })
};

module.exports = functions;