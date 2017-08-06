var express = require('express');
var mysql = require('mysql');
var Promise = require('promise');

var app = express();
const port = 3000;

var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'tHedAshc379sq',
    database: 'digitalcv',
    debug: false
});

function checkDatabase() {
    return new Promise(function(resolve, reject) {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }

            conn.query("SHOW TABLES", function(err, result) {
                conn.release();

                if (!err) {
                    if (result.length > 1) {
                        return resolve();
                    } else {
                        return reject("Database has not been setup. Please run migrations.");
                    }
                }
            });

            conn.once('error', function(err) {
                return reject(err);
            });
        });
    });
}

app.get('/', function (req, res) {
    res.status(200).json("Nothing to see here!");
});

app.get('/check-connection', function (req, res) {
    var testResults = {
        connection: true,
        database: false,
        err: ""
    };

    checkDatabase().then((result) => {
        testResults.database = true;
        testResults.err = result;
        res.status(200).json(testResults);
    }).catch((err) => {
        testResults.err = err;
        res.status(200).json(testResults);
    });
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Connection Error', err);
    }

    console.log(`server is listening on ${port}`);
});