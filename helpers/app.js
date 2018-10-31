const logManager = require('./logger');
logManager.createLogger('api');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const config = require('../config/config');

const TestController = require('../api/TestController');

var whiteList = config.debug ? config.corsWhiteListDebug : config.corsWhiteListProd;

var corsOptions = {
    origin: function (origin, cb) {
        if (origin === undefined || whiteList.indexOf(origin) !== -1 || whiteList.indexOf('*') !== -1) {
            cb(null, true);
        } else {
            cb(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};

var app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json({
    limit: '50mb'
}));

app.get('/', function(req, res) {
    res.status(200).json("Nothing to see here!");
});

app.post('/', function(req, res) {
    res.status(200).json("This is all good and all, but what do you want me to do with that data.");
});

app.use('/test', TestController);

module.exports = app;
