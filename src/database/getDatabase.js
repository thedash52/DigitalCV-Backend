import Logger from '../helpers/logger';
import database from '../helpers/database';

const { CLOUD_BUCKET } = process.env;

const logger = Logger.getLogger();
const db = new database();

const functions = {};

functions.getType = function () {
    db.select({ col: '*', table: 'type'}).then((res) => {
        return Promise.resolve({
            type: 'type',
            results: res
        });
    }).catch((err) => {
        logger.error(`Database error: ${err}`);

        return Promise.reject({
            method: 'getType',
            err: err
        });
    });
}

functions.getBasic = function () {
    db.select({ col: '*', table: 'basic', limit: '1'}).then((res) => {
        const { 0: basicData} = res;

        if (typeof (basicData) != 'undefined' && (basicData.folder_id && basicData.avatar_img && basicData.profile_img)) {
            basicData.avatar = `https://storage.googleapis.com/${CLOUD_BUCKET}/${basicData.folder_id}/${basicData.avatar_img}`;
            basicData.profile = `https://storage.googleapis.com/${CLOUD_BUCKET}/${basicData.folder_id}/${basicData.profile_img}`;

            return Promise.resolve({
                type: 'basic',
                results: basicData
            });
        } else {
            return Promise.resolve({
                type: 'basic',
                results: basicData
            });
        }
    }).catch((err) => {
        logger.error(`Database error: ${err}`);

        return Promise.reject({
            method: 'getBasic',
            err: err
        });
    });
}

functions.getPhone = function (id) {
    if (id > -1) {
        db.select({ col: '*', table: 'phone', conditions: `user = ${id}`}).then((res) => {
            if (res.length > 0) {
                db.select({ col: '*', table: 'type', conditions: `id IN ${res.map((data) => data.type_id)}`}).then((typeRes) => {
                    const phoneNumbers = [];
                    
                    for (let p = 0; p < res.length; p++) {
                        for (let t = 0; t < typeRes.length; t++) {
                            if (res[p].type_id == typeRes[t].id) {
                                const phoneDetails = {
                                    id: res[p].id,
                                    user: res[p].user,
                                    type: {
                                        id: typeRes[t].id,
                                        short: typeRes[t].short,
                                        long: typeRes[t].long
                                    },
                                    number: res[p].number
                                };

                                phoneNumbers.push(phoneDetails);
                            }
                        }

                        if (phoneNumbers.length == res.length) {
                            return Promise.resolve({
                                type: 'phone',
                                results: phoneNumbers
                            });
                        }
                    }
                }).catch((err) => {
                    logger.error(`Database error: ${err}`);
            
                    return Promise.reject({
                        method: 'getPhone',
                        err: err
                    });
                });
            } else {
                return Promise.resolve({
                    type: 'phone',
                    results: res
                });
            }
        }).catch((err) => {
            logger.error(`Database error: ${err}`);
    
            return Promise.reject({
                method: 'getPhone',
                err: err
            });
        });
    } else {
        return Promise.resolve({
            type: 'phone',
            results: null
        });
    }
}

functions.getSocial = function (id) {
    if (id > -1) {
        db.select({ col: '*', table: 'social', conditions: `user = ${id}`}).then((res) => {
            if (res.length > 0) {
                db.select({ col: '*', table: 'type', conditions: `id IN ${res.map((data) => data.type_id)}`}).then((typeRes) => {
                    const socialData = [];

                    for (let s = 0; s < res.length; s++) {
                        for (let t = 0; t < typeRes.length; t++) {
                            if (res[s].type_id == typeRes[t].id) {
                                const socialDetails = {
                                    id: res[s].id,
                                    user: res[s].user,
                                    type: {
                                        id: typeRes[t].id,
                                        short: typeRes[t].short,
                                        long: typeRes[t].long
                                    },
                                    link: res[s].link
                                };

                                socialData.push(socialDetails);
                            }
                        }

                        if (res.length == socialData.length) {
                            return Promise.resolve({
                                type: 'social',
                                results: socialData
                            });
                        }
                    }
                }).catch((err) => {
                    logger.error(`Database error: ${err}`);
            
                    return Promise.reject({
                        method: 'getSocial',
                        err: err
                    });
                });
            } else {
                return Promise.resolve({
                    type: 'social',
                    results: res
                });
            }
        }).catch((err) => {
            logger.error(`Database error: ${err}`);
    
            return Promise.reject({
                method: 'getSocial',
                err: err
            });
        });
    } else {
        return Promise.resolve({
            type: 'phone',
            results: null
        });
    }
}

functions.getSkills = function (id) {
    if (id > -1) {
        db.select({ col: '*', table: 'skill', conditions: `user = ${id}`}).then((res) => {
            return Promise.resolve({
                type: 'skills',
                results: res
            });
        }).catch((err) => {
            logger.error(`Database error: ${err}`);
    
            return Promise.reject({
                method: 'getSkills',
                err: err
            });
        });
    } else {
        return Promise.resolve({
            type: 'skills',
            results: null
        });
    }
}

functions.getTechnologies = function (id) {
    if (id > -1) {
        db.select({ col: '*', table: 'technology', conditions: `user = ${id}`}).then((res) => {
            const values = [];

            for (let r = 0; r < res.length; r++) {
                const value = {
                    id: res[r].id,
                    user: res[r].user,
                    img: res[r].image,
                    name: res[r].name,
                    detail: res[r].detail,
                    link: res[r].link,
                    category: res[r].category
                };

                values.push(value);

                if (values.length == res.length) {
                    return Promise.resolve({
                        type: 'technology',
                        results: values
                    });
                }
            }
        }).catch((err) => {
            logger.error(`Database error: ${err}`);
    
            return Promise.reject({
                method: 'getTechnologies',
                err: err
            });
        });
    } else {
        return Promise.resolve({
            type: 'technology',
            results: null
        });
    }
}

functions.getRepositories = function (id) {
    if (id > -1) {
        db.select({ col: '*', table: 'repository', conditions: `user = ${id}`}).then((res) => {
            if (res.length > 0) {
                db.select({ col: '*', table: 'type', conditions: `id IN ${res.map((data) => data.type_id)}`}).then((typeRes) => {
                    const repositoryData = [];

                    for (let r = 0; r < res.length; r++) {
                        for (let t = 0; t < typeRes.length; t++) {
                            if (res[r].type_id == typeRes[t].id) {
                                const repoDetails = {
                                    id: res[r].id,
                                    user: res[r].user,
                                    type: {
                                        id: typeRes[t].id,
                                        short: typeRes[t].short,
                                        long: typeRes[t].long
                                    },
                                    link: res[r].link
                                };

                                repositoryData.push(repoDetails);
                            }
                        }

                        if (res.length == repositoryData.length) {
                            return Promise.resolve({
                                type: 'repository',
                                results: repositoryData
                            });
                        }
                    }
                }).catch((err) => {
                    logger.error(`Database error: ${err}`);
            
                    return Promise.reject({
                        method: 'getRepositories',
                        err: err
                    });
                });
            } else {
                return Promise.resolve({
                    type: 'repository',
                    results: res
                });
            }
        }).catch((err) => {
            logger.error(`Database error: ${err}`);
    
            return Promise.reject({
                method: 'getRepositories',
                err: err
            });
        });
    } else {
        return Promise.resolve({
            type: 'repository',
            results: null
        });
    }
}

functions.getExperience = function (id) {
    if (id > -1) {
        db.select({ col: '*', table: 'experience', conditions: `user = ${id}`}).then((res) => {
            return Promise.resolve({
                type: 'experience',
                results: res
            });
        }).catch((err) => {
            logger.error(`Database error: ${err}`);
    
            return Promise.reject({
                method: 'getExperience',
                err: err
            });
        });
    } else {
        return Promise.resolve({
            type: 'experience',
            results: null
        });
    }
}

functions.getEducation = function (id) {
    if (id > -1) {
        db.select({ col: '*', table: 'education', conditions: `user = ${id}`}).then((res) => {
            const values = [];

            for (let r = 0; r < res.length; r++) {
                var data = {
                    id: res[r].id,
                    user: res[r].user,
                    img: res[r].image,
                    course: res[r].course,
                    school: res[r].school,
                    link: res[r].link,
                    year: res[r].year
                };

                values.push(data);

                if (values.length == res.length) {
                    return Promise.resolve({
                        type: 'education',
                        results: values
                    });
                }
            }
        }).catch((err) => {
            logger.error(`Database error: ${err}`);
            
            return Promise.reject({
                method: 'getEducation',
                err: err
            });
        });
    } else {
        return Promise.resolve({
            type: 'education',
            results: null
        });
    }
}

functions.getPapers = function (id) {
    if (id > -1) {
        db.select({ col: '*', table: 'paper', conditions: `course_id = ${id}`}).then((res) => {
            const values = [];

            for (let r = 0; r < res.length; r++) {
                var data = {
                    id: res[r].id,
                    code: res[r].code,
                    name: res[r].name,
                    detail: res[r].details,
                    grade: res[r].grade,
                    course: res[r].course_id
                };

                values.push(data);

                if (values.length == res.length) {
                    return Promise.resolve({
                        type: 'paper',
                        results: values
                    });
                }
            }
        }).catch((err) => {
            logger.error(`Database error: ${err}`);
    
            return Promise.reject({
                method: 'getPapers',
                err: err
            });
        });
    } else {
        return Promise.resolve({
            type: 'paper',
            results: null
        });
    }
}

functions.getAchievements = function (id) {
    if (id > -1) {
        db.select({ col: '*', table: 'achievement', conditions: `user = ${id}`}).then((res) => {
            const values = [];

            for (let r = 0; r < res.length; r++) {
                var data = {
                    id: res[r].id,
                    user: res[r].user,
                    name: res[r].name,
                    where: res[r].where,
                    whatWhy: res[r].what_why
                };

                values.push(data);

                if (values.length == res.length) {
                    return Promise.resolve({
                        type: 'achievement',
                        results: values
                    });
                }
            }
        }).catch((err) => {
            logger.error(`Database error: ${err}`);
    
            return Promise.reject({
                method: 'getAchievements',
                err: err
            });
        });
    } else {
        return Promise.resolve({
            type: 'achievement',
            results: null
        });
    }
}

functions.getInterests = function (id) {
    if (id > -1) {
        db.select({ col: '*', table: 'interest', conditions: `user = ${id}`}).then((res) => {
            const values = [];

            for (let r = 0; r < res.length; r++) {
                var data = {
                    id: res[r].id,
                    user: res[r].user,
                    img: res[r].image,
                    name: res[r].name
                };

                values.push(data);

                if (values.length == res.length) {
                    return Promise.resolve({
                        type: 'interest',
                        results: values
                    });
                }
            }
        }).catch((err) => {
            logger.error(`Database error: ${err}`);
    
            return Promise.reject({
                method: 'getInterests',
                err: err
            });
        });
    } else {
        return Promise.resolve({
            type: 'interest',
            results: null
        });
    }
}

export default functions;
