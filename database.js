var mysql = require('mysql');
var Promise = require('promise');

var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'tHedAshc379sq',
    database: 'digitalcv',
    debug: true
});

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
                    console.log(result);
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

exports.saveBasic = function saveBasic(basicData) {
    return new Promise(function (resolve, reject) {
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

            if (basicData.id && basicData.id != "") {
                sql = "UPDATE `basic` SET avatar_img='" + basicData.avatar_img + "', profile_img='" + basicData.profile_img + "', name='" + basicData.name + "', address_1='" + basicData.address_1 + "', address_2='" + basicData.address_2 + "', address_3='" + basicData.address_3 + "', city='" + basicData.city + "', summary='" + basicData.summary + "', show_referees='" + basicData.show_referees + "', show_repositories='" + basicData.show_repositories + "' WHERE id=" + basicData.id;
            } else {
                sql = "INSERT INTO `basic` (avatar_img, profile_img, name, address_1, address_2, address_3, city, summary, show_referees, show_repositories) VALUES ('" + basicData.avatar_img + "', '" + basicData.profile_img + "', '" + basicData.name + "', '" + basicData.address_1 + "', '" + basicData.address_2 + "', '" + basicData.address_3 + "', '" + basicData.city + "', '" + basicData.summary + "', '" + show_referees + "', '" + show_repositories + "')";
            }

            conn.query(sql, function (err, result) {
                conn.release();

                if (!err) {
                    return resolve(result.insertId);
                }
            });

            conn.once('error', function (err) {
                return reject({
                    method: "saveBasic",
                    err: err
                });
            });
        });
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
                        }
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
                        }
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
                        }
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
                        }
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
                        }
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
                        }
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
                            }
                        });

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
                        }
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
                        }
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
                        }
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