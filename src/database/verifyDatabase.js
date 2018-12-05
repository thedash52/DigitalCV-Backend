import Logger from '../helpers/logger';
import database from '../helpers/database';

const { CLOUD_BUCKET } = process.env;

const logger = Logger.getLogger();
const db = new database();

const functions = {};

functions.verifyBasic = function (basicData) {
    if (basicData) {
        db.select({ col: '*', table: 'basic' }).then((res) => {
            //eslint-disable-next-line camelcase
            basicData.show_referees = basicData.show_referees ? 1 : 0;
            //eslint-disable-next-line camelcase
            basicData.show_repositories = basicData.show_repositories ? 1 : 0;

            const { 0: basic} = res;

            basic.avatar = `https://storage.googleapis.com/${CLOUD_BUCKET}/${basicData.folder_id}/${basicData.avatar_img}`;
            basic.profile = `https://storage.googleapis.com/${CLOUD_BUCKET}/${basicData.folder_id}/${basicData.profile_img}`;

            if (JSON.stringify(basic) !== JSON.stringify(basicData)) {
                return Promise.resolve({
                    type: 'basic',
                    result: false
                });
            } else {
                return Promise.resolve({
                    type: 'basic',
                    result: true
                });
            }
        }).catch((err) => {
            logger.error(`Database error: ${err}`);
    
            return Promise.reject({
                method: 'verifyBasic',
                err: err
            });
        });
    } else {
        logger.error('Data missing. Failed data verification');

        return Promise.reject({
            method: 'verifyBasic',
            err: 'Data missing. Failed data verification'
        });
    }
}

functions.verifyPhone = function (phoneData) {
    if (phoneData) {
        db.select({ col: '*', table: 'phone' }).then((res) => {
            let incorrectData = false;

            for (let r = 0; r < res.length; r++) {
                let matchingRecord = false;

                for (let p = 0; p < phoneData.length; p++) {
                    const test = {
                        id: phoneData[p].id,
                        user: phoneData[p].user,
                        type_id: phoneData[p].type.id,
                        number: phoneData[p].number
                    };

                    if (JSON.stringify(res[r]) == JSON.stringify(test)) {
                        matchingRecord = true;
                    }

                    if (p == (phoneData.length - 1)) {
                        if (!matchingRecord) {
                            incorrectData = true;
                        }
                    }
                }

                if (r == (res.length - 1)) {
                    if (incorrectData) {
                        return Promise.resolve({
                            type: 'phone',
                            result: false
                        });
                    } else {
                        return Promise.resolve({
                            type: 'phone',
                            result: true
                        });
                    }
                }
            }
        }).catch((err) => {
            logger.error(`Database error: ${err}`);
    
            return Promise.reject({
                method: 'verifyPhone',
                err: err
            });
        });
    } else {
        logger.error('Data missing. Failed data verification');

        return Promise.reject({
            method: 'verifyPhone',
            err: 'Data missing. Failed data verification'
        });
    }
}

functions.verifySocial = function (socialData) {
    if (socialData) {
        db.select({ col: '*', table: 'social' }).then((res) => {
            let incorrectData = false;

            for (let r = 0; r < res.length; r++) {
                let matchingRecord = false;

                for (let s = 0; s < socialData.length; s++) {
                    const test = {
                        id: socialData[s].id,
                        user: socialData[s].user,
                        type_id: socialData[s].type.id,
                        link: socialData[s].link
                    };

                    if (JSON.stringify(res[r]) == JSON.stringify(test)) {
                        matchingRecord = true;
                    }

                    if (s == (socialData.length - 1)) {
                        if (!matchingRecord) {
                            incorrectData = true;
                        }
                    }
                }

                if (r == (res.length - 1)) {
                    if (incorrectData) {
                        return Promise.resolve({
                            type: 'social',
                            result: false
                        });
                    } else {
                        return Promise.resolve({
                            type: 'social',
                            result: true
                        });
                    }
                }
            }
        }).catch((err) => {
            logger.error(`Database error: ${err}`);
    
            return Promise.reject({
                method: 'verifySocial',
                err: err
            });
        });
    } else {
        logger.error('Data missing. Failed data verification');

        return Promise.reject({
            method: 'verifySocial',
            err: 'Data missing. Failed data verification'
        });
    }
}

functions.verifySkill = function (skillData) {
    if (skillData) {
        db.select({ col: '*', table: 'skill' }).then((res) => {
            let incorrectData = false;

            for (let r = 0; r < res.length; r++) {
                let matchingRecord = false;

                for (let s = 0; s < skillData.length; s++) {
                    const test = {
                        id: skillData[s].id,
                        user: skillData[s].user,
                        category: skillData[s].category,
                        details: skillData[s].details
                    };

                    if (JSON.stringify(res[r]) == JSON.stringify(test)) {
                        matchingRecord = true;
                    }

                    if (s == (skillData.length - 1)) {
                        if (!matchingRecord) {
                            incorrectData = true;
                        }
                    }
                }

                if (r == (res.length - 1)) {
                    if (incorrectData) {
                        return Promise.resolve({
                            type: 'skill',
                            result: false
                        });
                    } else {
                        return Promise.resolve({
                            type: 'skill',
                            result: true
                        });
                    }
                }
            }
        }).catch((err) => {
            logger.error(`Database error: ${err}`);
    
            return Promise.reject({
                method: 'verifySkill',
                err: err
            });
        });
    } else {
        logger.error('Data missing. Failed data verification');

        return Promise.reject({
            method: 'verifySkill',
            err: 'Data missing. Failed data verification'
        });
    }
}

functions.verifyTech = function (techData) {
    if (techData) {
        db.select({ col: '*', table: 'technology' }).then((res) => {
            let incorrectData = false;

            for (let r = 0; r < res.length; r++) {
                let matchingRecord = false;

                for (let t = 0; t < techData.length; t++) {
                    const test = {
                        id: techData[t].id,
                        user: techData[t].user,
                        image: techData[t].img,
                        name: techData[t].name,
                        detail: techData[t].detail,
                        link: techData[t].link,
                        category: techData[t].category
                    }

                    if (JSON.stringify(res[r]) == JSON.stringify(test)) {
                        matchingRecord = true;
                    }

                    if (t == (techData.length - 1)) {
                        if (!matchingRecord) {
                            incorrectData = true;
                        }
                    }
                }

                if (r == (res.length - 1)) {
                    if (incorrectData) {
                        return Promise.resolve({
                            type: 'technology',
                            result: false
                        });
                    } else {
                        return Promise.resolve({
                            type: 'technology',
                            result: true
                        });
                    }
                }
            }
        }).catch((err) => {
            logger.error(`Database error: ${err}`);
    
            return Promise.reject({
                method: 'verifyTech',
                err: err
            });
        });
    } else {
        logger.error('Data missing. Failed data verification');

        return Promise.reject({
            method: 'verifyTech',
            err: 'Data missing. Failed data verification'
        });
    }
}

functions.verifyRepo = function (repoData) {
    if (repoData) {
        db.select({ col: '*', table: 'repository' }).then((res) => {
            let incorrectData = false;

            for (let r = 0; r < res.length; r++) {
                let matchingRecord = false;

                for (let re = 0; re < repoData.length; re++) {
                    const test = {
                        id: repoData[re].id,
                        user: repoData[re].user,
                        type_id: repoData[re].type.id,
                        link: repoData[re].link
                    }

                    if (JSON.stringify(res[r]) == JSON.stringify(test)) {
                        matchingRecord = true;
                    }

                    if (re == (repoData.length - 1)) {
                        if (!matchingRecord) {
                            incorrectData = true;
                        }
                    }
                }

                if (r == (res.length - 1)) {
                    if (incorrectData) {
                        return Promise.resolve({
                            type: 'repository',
                            result: false
                        });
                    } else {
                        return Promise.resolve({
                            type: 'repository',
                            result: true
                        });
                    }
                }
            }
        }).catch((err) => {
            logger.error(`Database error: ${err}`);
    
            return Promise.reject({
                method: 'verifyRepo',
                err: err
            });
        });
    } else {
        logger.error('Data missing. Failed data verification');

        return Promise.reject({
            method: 'verifyRepo',
            err: 'Data missing. Failed data verification'
        });
    }
}

functions.verifyExperience = function (experienceData) {
    if (experienceData) {
        db.select({ col: '*', table: 'experience' }).then((res) => {
            let incorrectData = false;

            for (let r = 0; r < res.length; r++) {
                let matchingRecord = false;

                for (let e = 0; e < experienceData.length; e++) {
                    const test = {
                        id: experienceData[e].id,
                        user: experienceData[e].user,
                        image: experienceData[e].image,
                        title: experienceData[e].title,
                        location: experienceData[e].location,
                        description: experienceData[e].description,
                        start_date: new Date(experienceData[e].start_date),
                        end_date: new Date(experienceData[e].end_date),
                        current: experienceData[e].current ? 1 : 0
                    }

                    if (JSON.stringify(res[r]) == JSON.stringify(test)) {
                        matchingRecord = true;
                    }

                    if (e == (experienceData.length - 1)) {
                        if (!matchingRecord) {
                            incorrectData = true;
                        }
                    }
                }

                if (r == (res.length - 1)) {
                    if (incorrectData) {
                        return Promise.resolve({
                            type: 'experience',
                            result: false
                        });
                    } else {
                        return Promise.resolve({
                            type: 'experience',
                            result: true
                        });
                    }
                }
            }
        }).catch((err) => {
            logger.error(`Database error: ${err}`);
    
            return Promise.reject({
                method: 'verifyExperience',
                err: err
            });
        });
    } else {
        logger.error('Data missing. Failed data verification');

        return Promise.reject({
            method: 'verifyExperience',
            err: 'Data missing. Failed data verification'
        });
    }
}

functions.verifyEducation = function (educationData) {
    if (educationData) {
        db.select({ col: '*', table: 'education' }).then((res) => {
            let incorrectData = false;

            for (let r = 0; r < res.length; r++) {
                let matchingRecord = false;

                for (let e = 0; e < educationData.length; e++) {
                    const test = {
                        id: educationData[e].id,
                        user: educationData[e].user,
                        image: educationData[e].img,
                        course: educationData[e].course,
                        school: educationData[e].school,
                        link: educationData[e].link,
                        year: educationData[e].year
                    }

                    if (JSON.stringify(res[r]) == JSON.stringify(test)) {
                        matchingRecord = true;
                    }

                    if (e == (educationData.length - 1)) {
                        if (!matchingRecord) {
                            incorrectData = true;
                        }
                    }
                }

                if (r == (res.length - 1)) {
                    if (incorrectData) {
                        return Promise.resolve({
                            type: 'education',
                            result: false
                        });
                    } else {
                        return Promise.resolve({
                            type: 'education',
                            result: true
                        });
                    }
                }
            }
        }).catch((err) => {
            logger.error(`Database error: ${err}`);
    
            return Promise.reject({
                method: 'verifyEducation',
                err: err
            });
        });
    } else {
        logger.error('Data missing. Failed data verification');

        return Promise.reject({
            method: 'verifyEducation',
            err: 'Data missing. Failed data verification'
        });
    }
}

functions.verifyPapers = function (paperData) {
    if (paperData) {
        db.select({ col: '*', table: 'paper' }).then((res) => {
            let incorrectData = false;

            for (let r = 0; r < res.length; r++) {
                let matchingRecord = false;

                for (let p = 0; p < paperData.length; p++) {
                    const test = {
                        id: paperData[p].id,
                        code: paperData[p].code,
                        name: paperData[p].name,
                        details: paperData[p].detail,
                        grade: paperData[p].grade,
                        course_id: paperData[p].course
                    }

                    if (JSON.stringify(res[r]) == JSON.stringify(test)) {
                        matchingRecord = true;
                    }

                    if (p == (paperData.length - 1)) {
                        if (!matchingRecord) {
                            incorrectData = true;
                        }
                    }
                }

                if (r == (res.length - 1)) {
                    if (incorrectData) {
                        return Promise.resolve({
                            type: 'paper',
                            result: false
                        });
                    } else {
                        return Promise.resolve({
                            type: 'paper',
                            result: true
                        });
                    }
                }
            }
        }).catch((err) => {
            logger.error(`Database error: ${err}`);
    
            return Promise.reject({
                method: 'verifyPapers',
                err: err
            });
        });
    } else {
        logger.error('Data missing. Failed data verification');

        return Promise.reject({
            method: 'verifyPapers',
            err: 'Data missing. Failed data verification'
        });
    }
}

functions.verifyAchievements = function (achievementData) {
    if (achievementData) {
        db.select({ col: '*', table: 'achievement' }).then((res) => {
            let incorrectData = false;

            for (let r = 0; r < res.length; r++) {
                let matchingRecord = false;

                for (let a = 0; a < achievementData.length; a++) {
                    const test = {
                        id: achievementData[a].id,
                        user: achievementData[a].user,
                        name: achievementData[a].name,
                        where: achievementData[a].where,
                        what_why: achievementData[a].whatWhy
                    }

                    if (JSON.stringify(res[r]) == JSON.stringify(test)) {
                        matchingRecord = true;
                    }

                    if (a == (achievementData.length - 1)) {
                        if (!matchingRecord) {
                            incorrectData = true;
                        }
                    }
                }

                if (r == (res.length - 1)) {
                    if (incorrectData) {
                        return Promise.resolve({
                            type: 'achievement',
                            result: false
                        });
                    } else {
                        return Promise.resolve({
                            type: 'achievement',
                            result: true
                        });
                    }
                }
            }
        }).catch((err) => {
            logger.error(`Database error: ${err}`);
    
            return Promise.reject({
                method: 'verifyAchievements',
                err: err
            });
        });
    } else {
        logger.error('Data missing. Failed data verification');

        return Promise.reject({
            method: 'verifyAchievements',
            err: 'Data missing. Failed data verification'
        });
    }
}

functions.verifyInterests = function (interestData) {
    if (interestData) {
        db.select({ col: '*', table: 'interest' }).then((res) => {
            let incorrectData = false;

            for (let r = 0; r < res.length; r++) {
                let matchingRecord = false;

                for (let i = 0; i < interestData.length; i++) {
                    const test = {
                        id: interestData[i].id,
                        user: interestData[i].user,
                        image: interestData[i].img,
                        name: interestData[i].name
                    }

                    if (JSON.stringify(res[r]) == JSON.stringify(test)) {
                        matchingRecord = true;
                    }

                    if (i == (interestData.length - 1)) {
                        if (!matchingRecord) {
                            incorrectData = true;
                        }
                    }
                }

                if (r == (res.length - 1)) {
                    if (incorrectData) {
                        return Promise.resolve({
                            type: 'interest',
                            result: false
                        });
                    } else {
                        return Promise.resolve({
                            type: 'interest',
                            result: true
                        });
                    }
                }
            }
        }).catch((err) => {
            logger.error(`Database error: ${err}`);
    
            return Promise.reject({
                method: 'verifyInterests',
                err: err
            });
        });
    } else {
        logger.error('Data missing. Failed data verification');

        return Promise.reject({
            method: 'verifyInterests',
            err: 'Data missing. Failed data verification'
        });
    }
}

export default functions;
