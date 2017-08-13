var mysql = require('mysql');
var Promise = require('promise');

var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'tHedAshc379sq',
    database: 'digitalcv',
    debug: false
});

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
                    return resolve({
                        type: "basic",
                        results: result[0]
                    });
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
};

exports.getPhone = function getPhone() {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM phone", function (err, result) {
                if (!err) {
                    var phoneNumbers = [];
                    var count = 0;

                    if (result.length > 0) {
                        result.forEach(function (phone) {
                            conn.query("SELECT * FROM `type` WHERE `id` == phone.type_id", function (err, typeResult) {
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
                                }
                            });

                            if (count = result.length - 1) {
                                conn.release();
                                return resolve({
                                    type: "phone",
                                    results: phoneNumbers
                                });
                            } else {
                                count++;
                            }
                        });
                    } else {
                        conn.release();
                        return resolve({
                            type: "phone",
                            results: result
                        });
                    }
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
};

exports.getSocial = function getSocial() {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM social", function (err, result) {
                if (!err) {
                    var socialData = [];
                    var count = 0;

                    if (result.length > 0) {
                        result.forEach(function (social) {
                            conn.query("SELECT * FROM `type` WHERE `id` == social.type_id", function (err, typeResult) {
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
                                }
                            });

                            if (count = result.length - 1) {
                                conn.release();
                                return resolve({
                                    type: "social",
                                    results: socialData
                                });
                            } else {
                                count++;
                            }
                        });
                    } else {
                        conn.release();
                        return resolve({
                            type: "social",
                            results: result
                        });
                    }
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
};

exports.getSkills = function getSkills() {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM skill", function (err, result) {
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

exports.getTechnologies = function getTechnologies() {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM technology", function (err, result) {
                conn.release();

                if (!err) {
                    var values = [];

                    result.forEach(function (technology) {
                        var value = {
                            id: technology.id,
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
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.getRepositories = function getRepositories() {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM repository", function (err, result) {
                if (!err) {
                    var repositoryData = [];
                    var count = 0;

                    if (result.length > 0) {
                        result.forEach(function (respository) {
                            conn.query("SELECT * FROM `type` WHERE `id` == repository.type_id", function (err, typeResult) {
                                if (!err) {
                                    var repositoryDetails = {
                                        id: respository.id,
                                        user: respository.user,
                                        type: {
                                            id: typeResult[0].id,
                                            short: typeResult[0].short,
                                            long: typeResult[0].long
                                        },
                                        link: respository.link
                                    };

                                    repositoryData.push(repositoryDetails);
                                }
                            });

                            if (count = result.length - 1) {
                                conn.release();
                                return resolve({
                                    type: "repository",
                                    results: repositoryData
                                });
                            } else {
                                count++;
                            }
                        });
                    } else {
                        conn.release();
                        return resolve({
                            type: "repository",
                            results: result
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

exports.getExperience = function getExperience() {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM experience", function (err, result) {
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

exports.getEducation = function getEducation() {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM education", function (err, result) {
                conn.release();

                if (!err) {
                    var values = [];

                    result.forEach(function (education) {
                        var data = {
                            id: education.id,
                            img: education.image,
                            course: education.course,
                            school: education.school,
                            link: education.link,
                            category: education.category
                        };

                        values.push(data);
                    });

                    return resolve({
                        type: "education",
                        results: values
                    });
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.getPapers = function getPapers() {
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
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.getAchievements = function getAchievements() {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM achievement", function (err, result) {
                conn.release();

                if (!err) {
                    var values = [];

                    result.forEach(function (achievement) {
                        var data = {
                            id: achievement.id,
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
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}

exports.getInterests = function getInterests() {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM interest", function (err, result) {
                conn.release();

                if (!err) {
                    var values = [];

                    result.forEach(function (interest) {
                        var data = {
                            id: interest.id,
                            img: interest.image,
                            name: interest.name
                        };

                        values.push(data);
                    });

                    return resolve({
                        type: "interest",
                        results: values
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

            conn.query("SELECT * FROM basic", function (err, result) {
                conn.release();

                if (!err) {
                    let incorrectData = false;

                    result.forEach(basic => {
                        basicData.forEach(testData => {
                            if (basic != testData) {
                                incorrectData = true;
                            }
                        });
                    });

                    if (incorrectData) {
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
                        phoneData.forEach(testData => {
                            if (phone != testData) {
                                incorrectData = true;
                            }
                        });
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
                        socialData.forEach(testData => {
                            if (social != testData) {
                                incorrectData = true;
                            }
                        });
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
                        skillData.forEach(testData => {
                            if (skill != testData) {
                                incorrectData = true;
                            }
                        });
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
                        techData.forEach(testData => {
                            if (tech != testData) {
                                incorrectData = true;
                            }
                        });
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
                        repoData.forEach(testData => {
                            if (repo != testData) {
                                incorrectData = true;
                            }
                        });
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
                        experienceData.forEach(testData => {
                            if (experience != testData) {
                                incorrectData = true;
                            }
                        });
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
                        educationData.forEach(testData => {
                            if (education != testData) {
                                incorrectData = true;
                            }
                        });
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
                        paperData.forEach(testData => {
                            if (paper != testData) {
                                incorrectData = true;
                            }
                        });
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
                        achievmentData.forEach(testData => {
                            if (achievement != testData) {
                                incorrectData = true;
                            }
                        });
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
                        InterestData.forEach(testData => {
                            if (interest != testData) {
                                incorrectData = true;
                            }
                        });
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