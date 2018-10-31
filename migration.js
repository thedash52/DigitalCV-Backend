const mysql = require('mysql');
const migration = require('mysql-migrations');
const config = require('./config/config');
const path = require('path');

const pool = mysql.createPool(config.debug ? config.databaseDebug : config.databaseProd);

migration.init(pool, path.join(__dirname, '/migrations'));