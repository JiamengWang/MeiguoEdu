var LocalStrategy = require('passport-local').Strategy;
var pgdb = require('../query');

module.exports = new LocalStrategy(
    { passReqToCallback: true },
    function(req, username, password, done){
        return done(null, null, null, true);
        // check password correctness
        // if need to reset password
        // No
            // generate jwt
            // return error, token, userInfo, needReset=false
        // Yes
            // return error, token, userInfo, needReset=true
    }
);
