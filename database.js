var mysql = require('mysql');
var Promise = require('promise');
var fs = require('./fileSystem');
var uuid = require('uuid/v4');
var config = require('./config/config');

var options = {};

if (process.env.DB_INSTANCE_NAME && (process.env.NODE_ENV === 'production' || config.debug)) {
	options = {
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_DATABASE,
		socketPath: `/cloudsql/${process.env.DB_INSTANCE_NAME}`
	};
} else {
	options = config.databaseDebug;
}

var pool = mysql.createPool(options);

exports.login = function login(username, password) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM user", function (err, result) {
                conn.release();

                if (!err) {
                    result.forEach(user => {
                        if (user.username === username && user.password === password) {
                            return resolve(user);
                        }
                    });

                    return reject();
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.authenticate = function authenticate(id) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM user WHERE `id` = '" + id + "' LIMIT 1", function (err, result) {
                conn.release();

                if (!err) {
                    if (result.length > 0) {
                        return resolve(result[0]);
                    } else {
                        return reject();
                    }
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.checkDatabase = function checkDatabase() {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SHOW TABLES", function (err, result) {
                conn.release();

                if (!err) {
                    if (result.length > 1) {
                        return resolve();
                    } else {
                        return reject("Database has not been setup. Please run migrations.");
                    }
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
};

exports.getType = function getType() {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM type", function (err, result) {
                conn.release();

                if (!err) {
                    return resolve(result);
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.getBasic = function getBasic() {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM basic LIMIT 1", function (err, result) {
                conn.release();

                if (!err) {
                    var basicData = result[0];

                    if (typeof (basicData) != 'undefined' && (basicData.folder_id && basicData.avatar_img && basicData.profile_img)) {
                        fs.getBasicImages(basicData.folder_id, basicData.avatar_img, basicData.profile_img).then(images => {
                            basicData.avatar = images.avatar;
                            basicData.profile = images.profile;

                            return resolve({
                                type: "basic",
                                results: basicData
                            });
                        }).catch(err => {
                            return reject(err);
                        });
                    } else {
                        return resolve({
                            type: "basic",
                            results: basicData
                        });
                    }
                } else {
                    return reject({
                        method: "getBasic",
                        err: err
                    });
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
};

exports.getPhone = function getPhone(id) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            if (id > -1) {
                conn.query("SELECT * FROM phone WHERE `user` = " + id, function (err, result) {
                    if (!err) {
                        var phoneNumbers = [];

                        if (result.length > 0) {
                            result.forEach(function (phone) {
                                conn.query("SELECT * FROM `type` WHERE `id` = " + phone.type_id, function (err, typeResult) {
                                    if (!err) {
                                        var phoneDetails = {
                                            id: phone.id,
                                            user: phone.user,
                                            type: {
                                                id: typeResult[0].id,
                                                short: typeResult[0].short,
                                                long: typeResult[0].long
                                            },
                                            number: phone.number
                                        };

                                        phoneNumbers.push(phoneDetails);

                                        if (phoneNumbers.length == result.length) {
                                            conn.release();
                                            return resolve({
                                                type: "phone",
                                                results: phoneNumbers
                                            });
                                        }
                                    } else {
                                        return reject({
                                            method: "getPhone",
                                            err: err
                                        });
                                    }
                                });
                            });
                        } else {
                            conn.release();
                            return resolve({
                                type: "phone",
                                results: result
                            });
                        }
                    } else {
                        return reject({
                            method: "getPhone",
                            err: err
                        });
                    }
                });
            } else {
                return resolve({
                    type: "phone",
                    results: null
                });
            }

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
};

exports.getSocial = function getSocial(id) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            if (id > -1) {
                conn.query("SELECT * FROM social WHERE `user` = " + id, function (err, result) {
                    if (!err) {
                        var socialData = [];

                        if (result.length > 0) {
                            result.forEach(function (social) {
                                conn.query("SELECT * FROM `type` WHERE `id` = " + social.type_id, function (err, typeResult) {
                                    if (!err) {
                                        var socialDetails = {
                                            id: social.id,
                                            user: social.user,
                                            type: {
                                                id: typeResult[0].id,
                                                short: typeResult[0].short,
                                                long: typeResult[0].long
                                            },
                                            link: social.link
                                        };

                                        socialData.push(socialDetails);

                                        if (socialData.length == result.length) {
                                            conn.release();
                                            return resolve({
                                                type: "social",
                                                results: socialData
                                            });
                                        }
                                    } else {
                                        return reject({
                                            method: "getSocial",
                                            err: err
                                        });
                                    }
                                });
                            });
                        } else {
                            conn.release();
                            return resolve({
                                type: "social",
                                results: result
                            });
                        }
                    } else {
                        return reject({
                            method: "getSocial",
                            err: err
                        });
                    }
                });
            } else {
                return resolve({
                    type: "phone",
                    results: null
                });
            }

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
};

exports.getSkills = function getSkills(id) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM skill WHERE `user` = " + id, function (err, result) {
                conn.release();

                if (!err) {
                    return resolve(result);
                } else {
                    return reject({
                        method: "getSKills",
                        err: err
                    });
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.getTechnologies = function getTechnologies(id) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM technology WHERE `user` = " + id, function (err, result) {
                conn.release();

                if (!err) {
                    var values = [];

                    result.forEach(function (technology) {
                        var value = {
                            id: technology.id,
                            user: technology.user,
                            img: technology.image,
                            name: technology.name,
                            detail: technology.detail,
                            link: technology.link,
                            category: technology.category
                        };

                        values.push(value);
                    });

                    return resolve({
                        type: "technology",
                        results: values
                    });
                } else {
                    return reject({
                        method: "getTech",
                        err: err
                    });
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.getRepositories = function getRepositories(id) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM repository WHERE `user` = " + id, function (err, result) {
                if (!err) {
                    var repositoryData = [];

                    if (result.length > 0) {
                        result.forEach(function (repository) {
                            conn.query("SELECT * FROM `type` WHERE `id` = " + repository.type_id, function (err, typeResult) {
                                if (!err) {
                                    var repositoryDetails = {
                                        id: repository.id,
                                        user: repository.user,
                                        type: {
                                            id: typeResult[0].id,
                                            short: typeResult[0].short,
                                            long: typeResult[0].long
                                        },
                                        link: repository.link
                                    };

                                    repositoryData.push(repositoryDetails);

                                    if (repositoryData.length == result.length) {
                                        conn.release();
                                        return resolve({
                                            type: "repository",
                                            results: repositoryData
                                        });
                                    }
                                } else {
                                    return reject({
                                        method: "getRepo",
                                        err: err
                                    });
                                }
                            });
                        });
                    } else {
                        conn.release();
                        return resolve({
                            type: "repository",
                            results: result
                        });
                    }
                } else {
                    return reject({
                        method: "getRepo",
                        err: err
                    });
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.getExperience = function getExperience(id) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM experience WHERE `user` = " + id, function (err, result) {
                conn.release();

                if (!err) {
                    return resolve(result);
                } else {
                    return reject({
                        method: "getExperience",
                        err: err
                    });
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.getEducation = function getEducation(id) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM education WHERE `user` = " + id, function (err, result) {
                conn.release();

                if (!err) {
                    var values = [];

                    result.forEach(function (education) {
                        var data = {
                            id: education.id,
                            user: education.user,
                            img: education.image,
                            course: education.course,
                            school: education.school,
                            link: education.link,
                            year: education.year
                        };

                        values.push(data);
                    });

                    return resolve({
                        type: "education",
                        results: values
                    });
                } else {
                    return reject({
                        method: "getEducation",
                        err: err
                    });
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.getPapers = function getPapers(id) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM paper", function (err, result) {
                conn.release();

                if (!err) {
                    var values = [];

                    result.forEach(function (paper) {
                        var data = {
                            id: paper.id,
                            code: paper.code,
                            name: paper.name,
                            detail: paper.details,
                            grade: paper.grade,
                            course: paper.course_id
                        };

                        values.push(data);
                    });

                    return resolve({
                        type: "paper",
                        results: values
                    });
                } else {
                    return reject({
                        method: "getPapers",
                        err: err
                    });
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.getAchievements = function getAchievements(id) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM achievement WHERE `user` = " + id, function (err, result) {
                conn.release();

                if (!err) {
                    var values = [];

                    result.forEach(function (achievement) {
                        var data = {
                            id: achievement.id,
                            user: achievement.user,
                            name: achievement.name,
                            where: achievement.where,
                            whatWhy: achievement.what_why
                        };

                        values.push(data);
                    });

                    return resolve({
                        type: "achievement",
                        results: values
                    });
                } else {
                    return reject({
                        method: "getAchievements",
                        err: err
                    });
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.getInterests = function getInterests(id) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM interest WHERE `user` = " + id, function (err, result) {
                conn.release();

                if (!err) {
                    var values = [];

                    result.forEach(function (interest) {
                        var data = {
                            id: interest.id,
                            user: interest.user,
                            img: interest.image,
                            name: interest.name
                        };

                        values.push(data);
                    });

                    return resolve({
                        type: "interest",
                        results: values
                    });
                } else {
                    return reject({
                        method: "getInterests",
                        err: err
                    });
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.verifyBasic = function verifyBasic(basicData) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM basic WHERE `id` = " + basicData.id, function (err, result) {
                conn.release();

                if (!err) {
                    basicData.show_referees = basicData.show_referees ? 1 : 0;
                    basicData.show_repositories = basicData.show_repositories ? 1 : 0;

                    var basic = result[0];

                    fs.getBasicImages(basicData.folder_id, basic.avatar_img, basic.profile_img).then(images => {
                        basic.avatar = images.avatar;
                        basic.profile = images.profile;

                        if (JSON.stringify(basic) !== JSON.stringify(basicData)) {
                            return resolve({
                                type: "basic",
                                result: false
                            });
                        } else {
                            return resolve({
                                type: "basic",
                                result: true
                            });
                        }
                    });
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.verifyPhone = function verifyPhone(phoneData) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM phone", function (err, result) {
                conn.release();

                if (!err) {
                    let incorrectData = false;

                    result.forEach(phone => {
                        var matchingRecord = false;

                        phoneData.forEach(testData => {
                            var test = {
                                id: testData.id,
                                user: testData.user,
                                type_id: testData.type.id,
                                number: testData.number
                            };

                            if (JSON.stringify(phone) == JSON.stringify(test)) {
                                matchingRecord = true;
                            }
                        });

                        if (!matchingRecord) {
                            incorrectData = true;
                        }
                    });

                    if (incorrectData) {
                        return resolve({
                            type: "phone",
                            result: false
                        });
                    } else {
                        return resolve({
                            type: "phone",
                            result: true
                        });
                    }
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.verifySocial = function verifySocial(socialData) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM social", function (err, result) {
                conn.release();

                if (!err) {
                    let incorrectData = false;

                    result.forEach(social => {
                        let matchingRecord = false;

                        socialData.forEach(testData => {
                            var test = {
                                id: testData.id,
                                user: testData.user,
                                type_id: testData.type.id,
                                link: testData.link
                            };

                            if (JSON.stringify(social) == JSON.stringify(test)) {
                                matchingRecord = true;
                            }
                        });

                        if (!matchingRecord) {
                            incorrectData = true;
                        }
                    });

                    if (incorrectData) {
                        return resolve({
                            type: "social",
                            result: false
                        });
                    } else {
                        return resolve({
                            type: "social",
                            result: true
                        });
                    }
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.verifySkill = function verifySkill(skillData) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM skill", function (err, result) {
                conn.release();

                if (!err) {
                    let incorrectData = false;

                    result.forEach(skill => {
                        let matchingRecord = false;

                        skillData.forEach(testData => {
                            var test = {
                                id: testData.id,
                                user: testData.user,
                                category: testData.category,
                                details: testData.details
                            }

                            if (JSON.stringify(skill) == JSON.stringify(test)) {
                                matchingRecord = true;
                            }
                        });

                        if (!matchingRecord) {
                            incorrectData = true;
                        }
                    });

                    if (incorrectData) {
                        return resolve(false);
                    } else {
                        return resolve(true);
                    }
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.verifyTech = function verifyTech(techData) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM technology", function (err, result) {
                conn.release();

                if (!err) {
                    let incorrectData = false;

                    result.forEach(tech => {
                        let matchingRecord = false;

                        techData.forEach(testData => {
                            let test = {
                                id: testData.id,
                                user: testData.user,
                                image: testData.img,
                                name: testData.name,
                                detail: testData.detail,
                                link: testData.link,
                                category: testData.category
                            }

                            if (JSON.stringify(tech) == JSON.stringify(test)) {
                                matchingRecord = true;
                            }
                        });

                        if (!matchingRecord) {
                            incorrectData = true;
                        }
                    });

                    if (incorrectData) {
                        return resolve({
                            type: "technology",
                            result: false
                        });
                    } else {
                        return resolve({
                            type: "technology",
                            result: true
                        });
                    }
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.verifyRepo = function verifyRepo(repoData) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM repository", function (err, result) {
                conn.release();

                if (!err) {
                    let incorrectData = false;

                    result.forEach(repo => {
                        let matchingRecord = false;

                        repoData.forEach(testData => {
                            let test = {
                                id: testData.id,
                                user: testData.user,
                                type_id: testData.type.id,
                                link: testData.link
                            }

                            if (JSON.stringify(repo) == JSON.stringify(test)) {
                                matchingRecord = true;
                            }
                        });

                        if (!matchingRecord) {
                            incorrectData = true;
                        }
                    });

                    if (incorrectData) {
                        return resolve({
                            type: "repository",
                            result: false
                        });
                    } else {
                        return resolve({
                            type: "repository",
                            result: true
                        });
                    }
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.verifyExperience = function verifyExperience(experienceData) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM experience", function (err, result) {
                conn.release();

                if (!err) {
                    let incorrectData = false;

                    result.forEach(experience => {
                        let matchingRecord = false;

                        experienceData.forEach(testData => {
                            let test = {
                                id: testData.id,
                                user: testData.user,
                                image: testData.image,
                                title: testData.title,
                                location: testData.location,
                                description: testData.description,
                                start_date: new Date(testData.start_date),
                                end_date: new Date(testData.end_date),
                                current: testData.current ? 1 : 0
                            }

                            if (JSON.stringify(experience) == JSON.stringify(test)) {
                                matchingRecord = true;
                            }
                        });

                        if (!matchingRecord) {
                            incorrectData = true;
                        }
                    });

                    if (incorrectData) {
                        return resolve(false);
                    } else {
                        return resolve(true);
                    }
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.verifyEducation = function verifyEducation(educationData) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM education", function (err, result) {
                conn.release();

                if (!err) {
                    let incorrectData = false;

                    result.forEach(education => {
                        let matchingRecord = false;

                        educationData.forEach(testData => {
                            let test = {
                                id: testData.id,
                                user: testData.user,
                                image: testData.img,
                                course: testData.course,
                                school: testData.school,
                                link: testData.link,
                                year: testData.year
                            }

                            if (JSON.stringify(education) == JSON.stringify(test)) {
                                matchingRecord = true;
                            }
                        });

                        if (!matchingRecord) {
                            incorrectData = true;
                        }
                    });

                    if (incorrectData) {
                        return resolve({
                            type: "education",
                            result: false
                        });
                    } else {
                        return resolve({
                            type: "education",
                            result: true
                        });
                    }
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.verifyPapers = function verifyPapers(paperData) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM paper", function (err, result) {
                conn.release();

                if (!err) {
                    let incorrectData = false;

                    result.forEach(paper => {
                        let matchingRecord = false;

                        paperData.forEach(testData => {
                            let test = {
                                id: testData.id,
                                code: testData.code,
                                name: testData.name,
                                details: testData.detail,
                                grade: testData.grade,
                                course_id: testData.course
                            }

                            if (JSON.stringify(paper) == JSON.stringify(test)) {
                                matchingRecord = true;
                            }
                        });

                        if (!matchingRecord) {
                            incorrectData = true;
                        }
                    });

                    if (incorrectData) {
                        return resolve({
                            type: "paper",
                            result: false
                        });
                    } else {
                        return resolve({
                            type: "paper",
                            result: true
                        });
                    }
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.verifyAchievements = function verifyAchievements(achievmentData) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM achievement", function (err, result) {
                conn.release();

                if (!err) {
                    let incorrectData = false;

                    result.forEach(achievement => {
                        let matchingRecord = false;

                        achievmentData.forEach(testData => {
                            let test = {
                                id: testData.id,
                                user: testData.user,
                                name: testData.name,
                                where: testData.where,
                                what_why: testData.whatWhy
                            }

                            if (JSON.stringify(achievement) == JSON.stringify(test)) {
                                matchingRecord = true;
                            }
                        });

                        if (!matchingRecord) {
                            incorrectData = true;
                        }
                    });

                    if (incorrectData) {
                        return resolve({
                            type: "achievement",
                            result: false
                        });
                    } else {
                        return resolve({
                            type: "achievement",
                            result: true
                        });
                    }
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.verifyInterests = function verifyInterests(InterestData) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM interest", function (err, result) {
                conn.release();

                if (!err) {
                    let incorrectData = false;

                    result.forEach(interest => {
                        let matchingRecord = false;

                        InterestData.forEach(testData => {
                            let test = {
                                id: testData.id,
                                user: testData.user,
                                image: testData.img,
                                name: testData.name
                            }

                            if (JSON.stringify(interest) == JSON.stringify(test)) {
                                matchingRecord = true;
                            }
                        });

                        if (!matchingRecord) {
                            incorrectData = true;
                        }
                    });

                    if (incorrectData) {
                        return resolve({
                            type: "interest",
                            result: false
                        });
                    } else {
                        return resolve({
                            type: "interest",
                            result: true
                        });
                    }
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.saveBasic = function saveBasic(basicData) {
    return new Promise(function (resolve, reject) {
        var folderId;

        if (basicData.folder_id && basicData.folder_id != null && typeof (basicData.folder_id) != "undefined") {
            folderId = basicData.folder_id;
        } else {
            folderId = uuid();
        }

        fs.saveBasicImages(folderId, basicData.avatar, basicData.profile).then(paths =>
            pool.getConnection((err, conn) => {
                if (err) {
                    return reject({
                        method: "saveBasic",
                        err: err
                    });
                }

                var sql;
                var show_referees = basicData.show_referees ? 1 : 0;
                var show_repositories = basicData.show_repositories ? 1 : 0;

                if (basicData.id && basicData.id != null && typeof (basicData.id) != "undefined") {
                    sql = "UPDATE `basic` SET folder_id='" + folderId + "', avatar_img='" + paths.avatar + "', profile_img='" + paths.profile + "', name='" + basicData.name + "', address_1='" + basicData.address_1 + "', address_2='" + basicData.address_2 + "', address_3='" + basicData.address_3 + "', city='" + basicData.city + "', summary='" + basicData.summary + "', show_referees='" + show_referees + "', show_repositories='" + show_repositories + "' WHERE id=" + basicData.id;
                } else {
                    sql = "INSERT INTO `basic` (folder_id, avatar_img, profile_img, name, address_1, address_2, address_3, city, summary, show_referees, show_repositories) VALUES ('" + folderId + "', '" + paths.avatar + "', '" + paths.profile + "', '" + basicData.name + "', '" + basicData.address_1 + "', '" + basicData.address_2 + "', '" + basicData.address_3 + "', '" + basicData.city + "', '" + basicData.summary + "', '" + show_referees + "', '" + show_repositories + "')";
                }

                conn.query(sql, function (err, result) {
                    conn.release();

                    if (!err) {
                        if (result.insertId > 0) {
                            return resolve(result.insertId);
                        } else {
                            return resolve(basicData.id);
                        }
                    } else {
                        return reject({
                            method: "saveBasic",
                            err: err
                        });
                    }
                });

                conn.once('error', function (err) {
                    return reject({
                        method: "saveBasic",
                        err: err
                    });
                });
            })
        );
    });
}

exports.savePhone = function savePhone(id, phoneData) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject({
                    method: "savePhone",
                    err: err
                });
            }

            var insert = [];

            phoneData.forEach(phone => {
                insert.push([id, phone.type.id, phone.number]);
            })

            conn.query("DELETE FROM `phone` WHERE `user` = " + id, function (err, result) {
                if (!err) {
                    conn.query("INSERT INTO `phone` (user, type_id, number) VALUES ?", [insert], function (err, result) {
                        conn.release();

                        if (!err) {
                            return resolve();
                        } else {
                            return reject({
                                method: "savePhone",
                                err: err
                            });
                        }
                    });
                } else {
                    return reject({
                        method: "savePhone",
                        err: err
                    });
                }
            });

            conn.once('error', function (err) {
                return reject({
                    method: "savePhone",
                    err: err
                });
            });
        });
    });
}

exports.saveSocial = function saveSocial(id, socialData) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject({
                    method: "saveSocial",
                    err: err
                });
            }

            var insert = [];

            socialData.forEach(social => {
                insert.push([id, social.type.id, social.link]);
            });

            conn.query("DELETE FROM `social` WHERE `user` = " + id, function (err, result) {
                if (!err) {
                    conn.query("INSERT INTO `social` (user, type_id, link) VALUES ?", [insert], function (err, result) {
                        conn.release();

                        if (!err) {
                            return resolve();
                        } else {
                            return reject({
                                method: "saveSocial",
                                err: err
                            });
                        }
                    });
                } else {
                    return reject({
                        method: "saveSocial",
                        err: err
                    });
                }
            });

            conn.once('error', function (err) {
                return reject({
                    method: "saveSocial",
                    err: err
                });
            });
        });
    });
}

exports.saveSkill = function saveSkill(id, skillData) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject({
                    method: "saveSkill",
                    err: err
                });
            }

            var insert = [];

            skillData.forEach(skill => {
                insert.push([id, skill.category, skill.detail]);
            });

            conn.query("DELETE FROM `skill` WHERE `user` = " + id, function (err, result) {
                if (!err) {
                    conn.query("INSERT INTO `skill` (user, category, details) VALUES ?", [insert], function (err, result) {
                        conn.release();

                        if (!err) {
                            return resolve();
                        } else {
                            return reject({
                                method: "saveSkill",
                                err: err
                            });
                        }
                    });
                } else {
                    return reject({
                        method: "saveSkill",
                        err: err
                    });
                }
            });

            conn.once('error', function (err) {
                return reject({
                    method: "saveSkill",
                    err: err
                });
            });
        });
    });
}

exports.saveTechnology = function saveTechnology(id, technologyData) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject({
                    method: "saveTechnology",
                    err: err
                });
            }

            var insert = [];

            technologyData.forEach(tech => {
                insert.push([id, tech.img, tech.name, tech.detail, tech.src, tech.category]);
            });

            conn.query("DELETE FROM `technology` WHERE `user` = " + id, function (err, result) {
                if (!err) {
                    conn.query("INSERT INTO `technology` (user, image, name, detail, link, category) VALUES ?", [insert], function (err, result) {
                        conn.release();

                        if (!err) {
                            return resolve();
                        } else {
                            return reject({
                                method: "saveTechnology",
                                err: err
                            });
                        }
                    });
                } else {
                    return reject({
                        method: "saveTechnology",
                        err: err
                    });
                }
            });

            conn.once('error', function (err) {
                return reject({
                    method: "saveTechnology",
                    err: err
                });
            });
        });
    });
}

exports.saveRepository = function saveRepository(id, repositoryData) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject({
                    method: "saveRepostitory",
                    err: err
                });
            }

            var insert = [];

            repositoryData.forEach(repo => {
                insert.push([id, repo.type.id, repo.link]);
            });

            conn.query("DELETE FROM `repository` WHERE `user` = " + id, function (err, result) {
                if (!err) {
                    conn.query("INSERT INTO `repository` (user, type_id, link) VALUES ?", [insert], function (err, result) {
                        conn.release();

                        if (!err) {
                            return resolve();
                        } else {
                            return reject({
                                method: "saveRepo",
                                err: err
                            });
                        }
                    });
                } else {
                    return reject({
                        method: "saveRepo",
                        err: err
                    });
                }
            });

            conn.once('error', function (err) {
                return reject({
                    method: "saveRepository",
                    err: err
                });
            });
        });
    });
}

exports.saveExperience = function saveExperience(id, experienceData) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject({
                    method: "saveExperience",
                    err: err
                });
            }

            var insert = [];

            experienceData.forEach(experience => {
                var current = experience.current ? 1 : 0;
                var startDate = new Date(experience.startDate);
                var endDate = new Date(experience.endDate);

                insert.push([id, experience.img, experience.title, experience.location, experience.description, startDate, endDate, current]);
            });

            conn.query("DELETE FROM `experience` WHERE `user` = " + id, function (err, result) {
                if (!err) {
                    conn.query("INSERT INTO `experience` (user, image, title, location, description, start_date, end_date, current) VALUES ?", [insert], function (err, result) {
                        conn.release();

                        if (!err) {
                            return resolve();
                        } else {
                            return reject({
                                method: "saveExperience",
                                err: err
                            });
                        }
                    });
                } else {
                    return reject({
                        method: "saveExperience",
                        err: err
                    });
                }
            });

            conn.once('error', function (err) {
                return reject({
                    method: "saveExperience",
                    err: err
                });
            });
        });
    });
}

exports.saveEducation = function saveEducation(id, educationData) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject({
                    method: "saveEducation",
                    err: err
                });
            }

            conn.query("DELETE FROM `education` WHERE `user` = " + id, function (err, result) {
                if (!err) {
                    var count = 0;

                    educationData.forEach(education => {
                        conn.query("INSERT INTO `education` (user, image, course, school, link, year) VALUES (" + id + ", '" + education.img + "', '" + education.course + "', '" + education.school + "', '" + education.src + "', " + education.year + ")", function (educationErr, educationResult) {
                            if (!educationErr) {
                                savePaper(educationResult.insertId, education.papers).then(() => {
                                    count++;

                                    if (count == educationData.length) {
                                        conn.release();
                                        return resolve();
                                    }
                                });
                            } else {
                                return reject({
                                    method: "saveEducation",
                                    err: educationErr
                                });
                            }
                        });

                    });
                } else {
                    return reject({
                        method: "saveEducation",
                        err: err
                    });
                }
            });

            conn.once('error', function (err) {
                return reject({
                    method: "saveEducation",
                    err: err
                });
            });
        });
    });
}

function savePaper(id, paperData) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject({
                    method: "savePaper",
                    err: err
                });
            }

            var insert = [];

            paperData.forEach(paper => {
                insert.push([paper.code, paper.name, paper.details, paper.grade, id]);
            });

            conn.query("DELETE FROM `paper` WHERE `course_id` = " + id, function (err, result) {
                if (!err) {
                    conn.query("INSERT INTO `paper` (code, name, details, grade, course_id) VALUES ?", [insert], function (err, result) {
                        conn.release();

                        if (!err) {
                            return resolve();
                        } else {
                            return reject({
                                method: "savePaper",
                                err: err
                            });
                        }
                    });
                } else {
                    return reject({
                        method: "savePaper",
                        err: err
                    });
                }
            });

            conn.once('error', function (err) {
                return reject({
                    method: "saveAchievement",
                    err: err
                });
            });
        });
    });
}

exports.saveAchievement = function saveAchievement(id, achievementData) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject({
                    method: "saveAchievement",
                    err: err
                });
            }

            var insert = [];

            achievementData.forEach(achievement => {
                insert.push([id, achievement.name, achievement.where, achievement.whatWhy]);
            });

            conn.query("DELETE FROM `achievement` WHERE `user` = " + id, function (err, result) {
                if (!err) {
                    conn.query("INSERT INTO `achievement` (user, name, `where`, what_why) VALUES ?", [insert], function (err, result) {
                        conn.release();

                        if (!err) {
                            return resolve();
                        } else {
                            return reject({
                                method: "saveAchievement",
                                err: err
                            });
                        }
                    });
                } else {
                    return reject({
                        method: "saveAchievement",
                        err: err
                    });
                }
            });

            conn.once('error', function (err) {
                return reject({
                    method: "saveAchievement",
                    err: err
                });
            });
        });
    });
}

exports.saveInterest = function saveInterest(id, interestData) {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject({
                    method: "saveInterest",
                    err: err
                });
            }

            var insert = [];

            interestData.forEach(interest => {
                insert.push([id, interest.img, interest.name]);
            });

            conn.query("DELETE FROM `interest` WHERE `user` = " + id, function (err, result) {
                if (!err) {
                    conn.query("INSERT INTO `interest` (user, image, name) VALUES ?", [insert], function (err, result) {
                        conn.release();

                        if (!err) {
                            return resolve();
                        } else {
                            return reject({
                                method: "saveInterest",
                                err: err
                            });
                        }
                    });
                } else {
                    return reject({
                        method: "saveInterest",
                        err: err
                    });
                }
            });

            conn.once('error', function (err) {
                return reject({
                    method: "saveInterest",
                    err: err
                });
            });
        });
    });
}