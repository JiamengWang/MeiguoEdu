/**
 * Created by wjm-harry on 8/5/17.
 */
var jwt = require('jsonwebtoken');
// var cert = fs.readFileSync('./private.key');
var cert = 'wjm';
var db = require('../query.js');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');

const levelcontrol = yaml.safeLoad(fs.readFileSync(path.join(__dirname, './levelcontrol.yaml'), 'utf8'));

const STUDENT = new RegExp("^\/student\/?");
const STAFF = new RegExp("^\/staff\/?");
const USER = new RegExp("/^\/user\/?/");

module.exports = {
    check:CheckJWT,
}

function CheckJWT(req,res,next) {
    console.log('check',req.method,levelcontrol);
    console.log(whichPath(req.url));

    jwt.verify(req.cookies.jwt,cert,function (err,decode) {
        if(err) {
            console.log(err);
            res.end('JWT invalidate!');
            return;
        }
        req.who = decode.sub;
        console.log('JWT validate');
        db.fetchrole(req,res,next,whichPath(req.url),levelcontrol,function (err,data,path) {
            if (err) {
                console.log(err);
                return next(err);
            } else {
                console.log(data);

            }
        })
        return next();
    });




    //check success, promise the request
    return next();
}


function whichPath(path) {
    if (STUDENT.test(path)) {
        return 'STUDENT';
    }

    if (STAFF.test(path)) {
        return 'STAFF';
    }

    if (USER.test(path)) {
        return 'USER';
    }
    return null;
}