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

exports.getBasic = function getBasic() {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SELECT * FROM basic", function (err, result) {
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
                                return resolve(phoneNumbers);
                            } else {
                                count++;
                            }
                        });
                    } else {
                        conn.release();
                        return resolve(result);
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
                                return resolve(socialData);
                            } else {
                                count++;
                            }
                        });
                    } else {
                        conn.release();
                        return resolve(result);
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

                    return resolve(values);
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
                                return resolve(repositoryData);
                            } else {
                                count++;
                            }
                        });
                    } else {
                        conn.release();
                        return resolve(result);
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

                    return resolve(values);
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

                    return resolve(values);
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

                    return resolve(values);
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

                    return resolve(values);
                }
            });

            conn.once('error', function (err) {
                return reject(err);
            });
        });
    });
}