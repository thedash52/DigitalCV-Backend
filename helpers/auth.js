const passport = require('passport');
const passportJwt = require('passport-jwt');
// const database = require('../database');
const config = require('../config/config');
const { ExtractJwt: extract, Strategy } = passportJwt;

const params = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: extract.fromAuthHeader(),
    ignoreExpiration: false
};

module.exports = function () {
    const strategy = new Strategy(params, function (payload, done) {
        database.authenticate(payload.id).then((user) => {
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

    return {
        initialize: function () {
            return passport.initialize();
        },
        authenticate: function () {
            return passport.authenticate("jwt", {
                session: false
            });
        }
    };
};