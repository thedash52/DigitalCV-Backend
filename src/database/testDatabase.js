import Logger from '../helpers/logger';
import database from '../helpers/database';

const logger = Logger.getLogger();
const db = new database();

const functions = {};

functions.checkDatabase = function () {
    const tables = [
        'achievement',
        'basic',
        'education',
        'experience',
        'interest',
        'paper',
        'phone',
        'repository',
        'skill',
        'social',
        'technology',
        'type',
        'user'
    ]

    //eslint-disable-next-line max-statements
    return db.showTables().then((res) => {
        let numTables = 0;
        const migrationTableRegex = new RegExp('(.*)mysql_migrations(.*)');

        for (let i = 0; i < res.length; i++) {
            const tableName = res[i]['Tables_in_digitalcv']

            if (!migrationTableRegex.test(tableName)) {
                let foundTable = false;

                for (let r = 0; r < tables.length; r++) {
                    if (tableName == tables[r]) {
                        foundTable = true;
                    }

                    if (r == (tables.length - 1)) {
                        //eslint-disable-next-line max-depth
                        if (foundTable) {
                            numTables += 1;
                        }
                    }
                }
            }

            if (i == (res.length - 1)) {
                if (numTables != tables.length) {
                    const missingTables = [];

                    for (let t = 0; t < tables.length; t++) {
                        let tableFound = false;

                        //eslint-disable-next-line max-depth
                        for (let n = 0; n < res.length; n++) {
                            const testingTable = res[n]['Tables_in_digitalcv'];
                            //eslint-disable-next-line max-depth
                            if (tables[t] == testingTable) {
                                tableFound = true;
                            }

                            //eslint-disable-next-line max-depth
                            if (n == (res.length - 1)) {
                                //eslint-disable-next-line max-depth
                                if (!tableFound) {
                                    missingTables.push(res[n]);
                                }
                            }
                        }

                        //eslint-disable-next-line max-depth
                        if (t == (tables.length - 1)) {
                            logger.error(`Database setup incorrectly. Missing the following tables: ${missingTables}`);

                            return Promise.reject({
                                method: 'checkDatabase',
                                err: `Database setup incorrectly. Missing the following tables: ${missingTables}`
                            });
                        }
                    }
                } else {
                    return Promise.resolve({
                        type: 'databaseConnection',
                        results: true
                    });
                }
            }
        }
    }).catch((err) => {
        logger.error(`Database Error: ${err}`);

        return Promise.reject({
            method: 'checkDatabase',
            err: err
        });
    })
}

export default functions;
