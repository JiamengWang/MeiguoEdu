var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var yaml = require('js-yaml');
var fs = require('fs');
var path = require('path');
var pgdb = require('../query');
var utiliy = require('../utility/rawdataProcess');

const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../config.yaml'), 'utf8'));

module.exports = new LocalStrategy(
    { passReqToCallback: true },
    function(req, username, password, done){
        pgdb.getoneFromLoginCB(req,
            (data) => {
                // console.log(data);
                let userInfo = {username: username};
                if(!data.password){
                    userInfo.err = username + ' dose not have password in database';
                    return done(null, userInfo);
                }

                bcrypt.compare(password, data.password, function(err, isMatched){
                    if(err) return done(err);

                    if(isMatched == false){
                        userInfo.err = 'invalid username or password';
                        return done(null, userInfo);
                    }

                    if(data.isvisited == 0){
                        userInfo.needReset = true;
                        return done(null, userInfo);
                    }

                    userInfo.token = jwt.sign(
                        {   exp: Math.floor(Date.now() / 1000) + config['JWT']['EXP'],
                            sub: utiliy.md5(username),
                            role: data.role
                        }, config['JWT']['SECRET']
                    );
                    return done(null, userInfo);
                });
            },
            (err) => {return done(err)}
        );
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
