const mysql = require('mysql');
const migration = require('mysql-migrations');
const config = require('./config/config');

const pool = mysql.createPool(config.debug ? config.databaseDebug : config.databaseProd);

migration.init(pool, __dirname + '/migrations');