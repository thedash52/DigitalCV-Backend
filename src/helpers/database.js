import { databaseDebug, debug } from '../config/config';
import db from 'mysql';

export default class DB {

    constructor() {
        let options = {};

        if (process.env.NODE_ENV === 'production' || !debug) {
            options = {
                connectionLimit: 100,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_DATABASE,
                host: process.env.DB_HOST
            };
        } else {
            options = databaseDebug;
        }

        this.pool = db.createPool(options);
    }

    select({
        col,
        table,
        join,
        conditions,
        groupby,
        having,
        orderby,
        limit
    }) {
        return new Promise((resolve, reject) => {
            conditions = conditions ? 'WHERE ' + conditions : '';
            groupby = groupby ? 'GROUP BY ' + groupby : '';
            having = having ? 'HAVING ' + having : '';
            orderby = orderby ? 'ORDER BY ' + orderby : '';
            join = join ? join.type + ' JOIN ' + join.table + ' ON ' + join.link : '';
            limit = limit ? 'LIMIT ' + limit : '';
            this.pool.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                }
                conn.query(`SELECT ${col} FROM ${table} ${join} ${conditions} ${groupby} ${having} ${orderby} ${limit}`, (errorResult, result) => {
                    conn.release();
                    if (!errorResult) {
                        resolve(result);
                    } else {
                        reject(errorResult);
                    }
                });
                conn.once('error', (error) => {
                    conn.release();
                    reject(error);
                });
            });
        });
    }

    insert({
        table,
        col,
        data
    }) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                }
                conn.query(`INSERT INTO '${table}' (${col}) VALUES (${data})`, (errorResult, result) => {
                    conn.release();
                    if (!errorResult) {
                        resolve(result);
                    } else {
                        reject(errorResult);
                    }
                });
                conn.once('error', (error) => {
                    conn.release();
                    reject(error);
                });
            });
        });
    }

    bulkInsert({
        table,
        col,
        data
    }) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                }
                conn.query(`INSERT INTO '${table}' (${col}) VALUES ?`, [data], (errorResult, result) => {
                    conn.release();
                    if (!errorResult) {
                        resolve(result);
                    } else {
                        reject(errorResult);
                    }
                });
                conn.once('error', (error) => {
                    conn.release();
                    reject(error);
                });
            });
        });
    }

    update({
        table,
        col,
        data,
        conditions
    }) {
        return new Promise((resolve, reject) => {
            if (conditions) {
                reject('Attempting to update all records. Attempt being seen as hack. Attempt Blocked.');
            } else {
                if (data.length !== col.length) {
                    reject('Invalid Query. Number of values to be updated does not match number of columns to be updated.');
                } else {
                    var updateData;
                    for (let i = 0; i < data.length; i++) {
                        if (i == data.length - 1) {
                            updateData += col[i] + ' = ' + data[i] + ', ';
                        } else {
                            updateData += col[i] + ' = ' + data[i];
                        }
                    }
                    this.pool.getConnection((err, conn) => {
                        if (err) {
                            reject(err);
                        }
                        conn.query(`UPDATE ${table} SET ${updateData} WHERE ${conditions}`, (errorResult, result) => {
                            conn.release();
                            if (!errorResult) {
                                resolve(result);
                            } else {
                                reject(errorResult);
                            }
                        });
                        conn.once('error', (error) => {
                            conn.release();
                            reject(error);
                        });
                    });
                }
            }
        });
    }

    delete({
        table,
        conditions,
        values
    }) {
        return new Promise((resolve, reject) => {
            if (conditions) {
                reject('Attempting to delete all records. Attempt being seen as hack. Now blocking attempt.');
            } else {
                this.pool.getConnection((err, conn) => {
                    if (err) {
                        reject(err);
                    }
                    if (values) {
                        conn.query(`DELETE FROM '${table}' WHERE ${conditions}`, values, (errorResult, result) => {
                            conn.release();
                            if (!errorResult) {
                                resolve(result);
                            } else {
                                reject(errorResult);
                            }
                        });
                    } else {
                        conn.query(`DELETE FROM '${table}' WHERE ${conditions}`, (errorResult, result) => {
                            conn.release();
                            if (!errorResult) {
                                resolve(result);
                            } else {
                                reject(errorResult);
                            }
                        });
                    }
                    conn.once('error', (error) => {
                        conn.release();
                        reject(error);
                    });
                });
            }
        });
    }

    showTables() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, conn) => {
                if (err) {
                    return reject(err);
                }

                conn.query("SHOW TABLES", function (errorResult, result) {
                    conn.release();

                    if (!errorResult) {
                        if (result.length > 1) {
                            return resolve(result);
                        } else {
                            return reject("Database has not been setup. Please run migrations.");
                        }
                    } else {
                        reject(err)
                    }
                });

                conn.once('error', function (error) {
                    return reject(error);
                });
            });
        })
    }
}