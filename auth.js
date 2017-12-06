var passport = require('passport');
var passportJwt = require('passport-jwt');
var database = require('./database');
var config = require('./config/config');
var extract = passportJwt.ExtractJwt;
var Strategy = passportJwt.Strategy;

var params = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: extract.fromAuthHeader(),
    ignoreExpiration: false
};

module.exports = function () {
    var strategy = new Strategy(params, function (payload, done) {
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