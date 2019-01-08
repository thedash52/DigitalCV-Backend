"use strict";

var mysql = require('mysql');

var migration = require('mysql-migrations');

var config = require('./config/config');

var path = require('path');

var options = {};

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

var pool = mysql.createPool(options);
migration.init(pool, path.join(__dirname, '/migrations'));
//# sourceMappingURL=migration.js.map