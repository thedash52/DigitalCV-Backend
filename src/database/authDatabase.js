import Logger from '../helpers/logger';
import database from '../helpers/database';

const logger = Logger.getLogger();
const db = new database();

const functions = {};

functions.login = function (username, password) {
    return db.select({ col: '*', table: 'user'}).then((res) => {
        for (let i = 0; i < res.length; i++) {
            if (res[i].username === username && res[i].password === password) {
                return Promise.resolve({
                    type: 'user',
                    results: res[i]
                });
            }

            if (i == (res.length - 1)) {
                return Promise.reject({
                    method: 'login',
                    err: 'Invalid Username and/or Password.'
                });
            }
        }
    }).catch((err) => {
        logger.error(`Database error: ${err}`);

        return Promise.reject({
            method: 'login',
            err: err
        });
    });
}

functions.authenticate = function (id, username) {
    return db.select({ col: '*', table: 'user', conditions: `id = '${id}' AND username = '${username}'`, limit: '1'}).then((res) => {
        if (res.length > 0) {
            return Promise.resolve({
                type: 'basic',
                results: res[0]
            });
        } else {
            return Promise.reject({
                method: 'authenticate',
                err: 'Error Authenticating User. Please try again.'
            });
        }
    }).catch((err) => {
        logger.error(`Database Error: ${err}`);

        return Promise.reject({
            method: 'authenticate',
            err: err
        });
    });
}

export default functions;
