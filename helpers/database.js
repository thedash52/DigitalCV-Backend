const mysql = require('mysql');
const Promise = require('promise');
const config = require('../config.json').local;

function DB() {
    const pool = mysql.createPool(config.debug ? config.databaseDebug : config.databaseProd);

    this.select = function ({ col, table, join, conditions, groupby, having, orderby, limit }) {
        return new Promise((resolve, reject) => {
            conditions = conditions ? 'WHERE ' + conditions : '';
            groupby = groupby ? 'GROUP BY ' + groupby : '';
            having = having ? 'HAVING ' + having : '';
            orderby = orderby ? 'ORDER BY ' + orderby : '';
            join = join ? join.type + ' JOIN ' + join.table + ' ON ' + join.link : '';
            limit = limit ? 'LIMIT ' + limit : '';

            pool.getConnection((err, conn) => {
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

    this.insert = function ({ table, col, data }) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                }

                conn.query(`INSERT INTO '${table}' (${col}) VALUES (${data})`,  (errorResult, result) => {
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

    this.bulkInsert = function ({ table, col, data }) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
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

    this.update = function ({table, col, data, conditions }) {
        return new Promise((resolve, reject) => {
            if (conditions) {
                reject('Attempting to update all records. Attempt being seen as hack. Now blocking attempt.');
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

                    pool.getConnection((err, conn) => {
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

    this.delete = function ({ table, conditions, values }) {
        return new Promise((resolve, reject) => {
            if (conditions) {
                reject('Attempting to delete all records. Attempt being seen as hack. Now blocking attempt.');
            } else {
                pool.getConnection((err, conn) => {
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
}

module.exports = new DB;