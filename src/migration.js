const mysql = require('mysql');
const migration = require('mysql-migrations');
const config = require('./config/config');
const path = require('path');

let options = {};

if (process.env.NODE_ENV === 'production' || !config.debug) {
    options = {
        connectionLimit: 100,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST
    };
} else {
    options = config.databaseDebug;
}

const pool = mysql.createPool(options);

migration.init(pool, path.join(__dirname, '/migrations'));