import { debug, jwtSecret } from '../config/config';
import Auth from '../helpers/auth';
import { Router } from 'express';
import bodyParser from 'body-parser';
import db from '../database/authDatabase';
import jwt from 'jsonwebtoken';

const auth = new Auth();

const routes = Router();

routes.use(bodyParser.json());

routes.get('/', function (req, res) {
	res.status(200).json('Nothing to see here!');
});

routes.post('/', function (req, res) {
	res.status(200).json('This is all good and all, but what do you want me to do with that data.');
});

routes.post('/login', function (req, res) {
    const { username, password } = req.body;
    
    if (username && password) {
        db.login(username, password).then(user => {
            if (user) {
                const payload = {
                    id: user.results.id,
                    username: username
                };

                const options = {
                    expiresIn: '3h',
                    issuer: 'TheDashCoder - DigitalCV',
                    subject: username,
                    audience: 'http://thedashcoder.online'
                }

                const token = jwt.sign(payload, debug? jwtSecret : process.env.JWT_SECRET, options);

                res.json({
                    success: 'true',
                    token: token
                });
            }
        }).catch(err => {
            res.status(401).json({
                success: 'false',
                result: err
            });
        });
    } else {
        res.sendStatus(401).json({
            success: 'false',
            result: 'Missing Username/Password.'
        });
    }
});

routes.get('/check-login', auth.authenticate(), function (req, res) {
    res.status(200).json(true);
});

export default routes;