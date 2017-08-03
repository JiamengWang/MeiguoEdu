var express = require('express');
var fs = require('fs');
var router = express.Router();
var path = require('path');
var dp = require('../utility/rawdataProcess');
var db = require('../query.js');


/**
 * @see https://www.npmjs.com/package/jsonwebtoken
 * */
var jwt = require('jsonwebtoken');
// var cert = fs.readFile('../private.key');
var cert = 'wjm';
// var session = require('express-session');


/* GET home page. */

router.get(/(^\/$)|(^\/login$)/, function(req, res, next) {
    res.sendFile('login.html', {root: path.join(__dirname, '../public/login')});
});

router.get('/test',function(req,res,next){
    res.end('test');
});

router.get('/testJWT',function (req,res,next) {
    console.log(req.cookies);

    try {
        var dec = jwt.verify(req.cookies.jwt, cert);
        console.log(dec);
    } catch(err) {
        console.log(err);
    }

    var message = jwt.decode(req.cookies.jwt, {complete: true});
    console.log(message);
    res.end('end');
});

router.post('/login',function (req,res,next) {
    console.log(req.body);
    console.log(cert);
    // validate success， then set jwt with different role according to role from login db
    var token = jwt.sign({
        role:'Admin',
        sub:'jiameng@usc.edu',
        idt:Math.floor(Date.now() / 1000),
        exp:Math.floor(Date.now() / 1000)+ 1000,
    }, cert);

    if (req.body.username="helen") {
        res.cookie('jwt', token, {httpOnly: true});
        res.json({
            code: '302',
            url: 'helen'
        });
    } else {
        res.cookie('jwt', token, {httpOnly: true});
        res.json({
            code: '302',
            url: 'admin'
        });
    }
    // res.redirect('/admin');
});

// router.post('/v1/user',function (req,res,next) {
//     console.log('/user',req.body);
//     res.end('end');
// })

router.get('/logout',function (req,res,next) {

    jwt.verify(req.cookies.jwt,cert,function (err,decode) {
        if(err) {
            console.log(err);
            res.redirect('/');
            res.end();
            return;
        }
        var token = jwt.sign({
            role:'TimeOut',
            sub:decode.sub,
            idt:Math.floor(Date.now() / 1000),
            exp:Math.floor(Date.now() / 1000) - 1000,
        }, cert);
        res.cookie('jwt',token,{httpOnly:true});
        res.json({
            code:'302',
            url:''
        });
    });
});

// router.post('/logintest',
//     passport.authenticate('local', { failureRedirect: '/',
//                                      failureFlash: true }),
//     function (req,res) {
//         res.redirect('/admin');
//     }
// );
router.get('/helen',function (req,res,next) {
    res.sendFile('/Users/wjm-harry/Documents/MeiguoEdu/public/helen/helen.html');
});
router.get('/admin',function (req,res,next) {
    validateRoleAndSendFile(res,req.cookies.jwt,'Admin','/Users/wjm-harry/Documents/MeiguoEdu/public/forAdmin/admin.html');
});

router.get('/doe',function (req,res,next) {
    validateRoleAndSendFile(res,req.cookies.jwt,'DOE','/Users/wjm-harry/Documents/MeiguoEdu/public/forAdmin/admin.html');
    res.end('request doe page');
});

router.get('/pmc',function (req,res,next) {
    validateRoleAndSendFile(res,req.cookies.jwt,'PMC','/Users/wjm-harry/Documents/MeiguoEdu/public/forAdmin/admin.html');
    res.end('request pmc page');
});

router.get('/student',function (req,res,next) {
    validateRoleAndSendFile(res,req.cookies.jwt,'Student','/Users/wjm-harry/Documents/MeiguoEdu/public/forAdmin/admin.html');
    res.end('request student page');
});


var validateRoleAndSendFile = function (res,cookie,role,path) {
    jwt.verify(cookie,cert,function (err,decode) {
        if (err) {
            console.log(err);
            res.redirect('/');
            res.end();
            return;
        }
        if (decode.role == role) {
            res.sendFile(path);
        } else {
            res.redirect('/');
            res.end();
        }
    });
}


module.exports = router;
