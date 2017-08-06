var mysql = require('mysql');
var migration = require('mysql-migrations');

var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'tHedAshc379sq',
    database: 'digitalcv'
});

migration.init(pool, __dirname + '/migrations');