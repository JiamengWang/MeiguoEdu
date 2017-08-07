var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var yaml = require('js-yaml');
var fs = require('fs');
var path = require('path');
var pgdb = require('../query');

const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../config.yaml'), 'utf8'));

module.exports = new LocalStrategy(
    { passReqToCallback: true },
    function(req, username, password, done){
        pgdb.getoneFromLoginCB(req,
            (data) => {
                let userInfo = {username: username, role: data.role};
                // check this user has password
                if(!data.password){
                    userInfo.err = username + ' dose not have password in database';
                    return done(null, userInfo);
                }

                // check old password match with db
                bcrypt.compare(password, data.password, function(err, isMatched){
                    if(err) return done(err);

                    if(isMatched === false || data.isvisited > 0){
                        userInfo.err = 'invalid username or password';
                        return done(null, userInfo);
                    }

                    // salt hash new password
                    bcrypt.hash(req.body.newPassword, config['BCRYPT']['SALT_ROUND'], function (err, hash) {
                        if(err) return done(err);
                        req.body.password = hash;
                        req.body.userID = data.id;
                        req.body.isvisited = data.isvisited + 1;
                        pgdb.userFirstLoginResetCB(req,
                            () => {
                                userInfo.token = jwt.sign(
                                    {   exp: Math.floor(Date.now() / 1000) + config['JWT']['EXP'],
                                        sub: username,
                                        role: data.role
                                    }, config['JWT']['SECRET']
                                );
                                return done(null, userInfo);
                            },
                            (err) => {return done(err)}
                        );
                    });
                });
            },
            (err) => {return done(err)}
        );
    }
);