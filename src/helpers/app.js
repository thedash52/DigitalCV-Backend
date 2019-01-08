import { corsWhiteListDebug, corsWhiteListProd, debug } from '../config/config';
import Auth from './auth';
import AuthController from '../api/AuthController';
import GetController from '../api/GetController';
import SaveController from '../api/SaveController';
import TestController from '../api/TestController';
import VerifyController from '../api/VerifyController';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

const auth = new Auth();

var whiteList = debug ? corsWhiteListDebug : corsWhiteListProd;

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
app.set('trust proxy', true);
app.use(cors(corsOptions));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(auth.initialize())

app.get('/', function(req, res) {
    res.status(200).json("Nothing to see here!");
});

app.post('/', function(req, res) {
    res.status(200).json("This is all good and all, but what do you want me to do with that data.");
});

app.use('/test', TestController);
app.use('/auth', AuthController);
app.use('/get', GetController);
app.use('/verify', VerifyController);
app.use('/save', SaveController);

export default app;
