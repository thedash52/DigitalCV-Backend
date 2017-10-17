var fs = require('fs');
var mkdir = require('mkdirp');

exports.saveBasicImages = function saveBasicImages(id, avatar_image, profile_image) {
    return new Promise((resolve, reject) => {
        var avatarImage = avatar_image.replace(/^data:image\/\w+;base64,/, '');
        var profileImage = profile_image.replace(/^data:image\/\w+;base64,/, '');

        var folderPath = __dirname + "/files/" + id + "/images/basic";

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

exports.getBasicImages = function getBasicImages(folderId, avatar_image, profile_image) {
    return new Promise((resolve, reject) => {
        var avatar = "data:image/jpeg;base64,";
        var profile = "data:image/jpeg;base64,";

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