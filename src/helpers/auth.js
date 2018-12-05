/*eslint-disable class-methods-use-this*/
import { debug, jwtSecret } from '../config/config';
import db from '../database/authDatabase';
import passport from 'passport';
import passportJwt from 'passport-jwt';

const { Strategy, ExtractJwt: extract } = passportJwt;

export default class Auth {
    constructor() {
        let params = {};

        if (process.env.NODE_ENV === 'production' || !debug) {
            params = {
                secretOrKey: process.env.JWT_SECRET,
                jwtFromRequest: extract.fromAuthHeaderAsBearerToken(),
                ignoreExpiration: false
            };
        } else {
            params = {
                secretOrKey: jwtSecret,
                jwtFromRequest: extract.fromAuthHeaderAsBearerToken(),
                ignoreExpiration: true
            };
        }

        const strategy = new Strategy(params, function (payload, done) {
            db.authenticate(payload.id, payload.username).then((user) => {
                return done(null, user);
            }).catch((err) => {
                if (err) {
                    return done(new Error(err), false);
                } else {
                    return done(null, false);
                }
            });
        });
    
        passport.use(strategy);
    }

    initialize() {
        return passport.initialize();
    }

    authenticate() {
        return passport.authenticate('jwt', {
            session: false
        });
    }
}