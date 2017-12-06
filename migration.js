var mysql = require('mysql');
var migration = require('mysql-migrations');
var config = require('./config/config');

var pool = mysql.createPool(config.debug ? config.databaseDebug : config.databaseProd);

migration.init(pool, __dirname + '/migrations');