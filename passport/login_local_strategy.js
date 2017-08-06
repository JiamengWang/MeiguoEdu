var LocalStrategy = require('passport-local').Strategy;
var pgdb = require('../query');

module.exports = new LocalStrategy(
    { passReqToCallback: true },
    function(req, username, password, done){
        pgdb.getoneFromLoginCB(req,
            (data) => {
                console.log(data);
                return done(null, null, username, false);
            },
            (err) => { return done(err, null, username, null) }
        );
        // check password correctness
        // if need to reset password
        // No
            // generate jwt
            // return error, token, userInfo, needReset=false
        // Yes
            // return error, token, userInfo, needReset=true
    }
);

/*
    This is an error when getting non-existing user
    QueryResultError {
        code: queryResultErrorCode.noData
        message: "No data returned from the query."
        received: 0
        query: "select * from login where username = 'abc1234@abc.com'"
    }
*/
