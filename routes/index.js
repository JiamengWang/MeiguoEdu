var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var yaml = require('js-yaml');
var fs = require('fs');
var path = require('path');
const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../config.yaml'), 'utf8'));

/**
 * @see https://www.npmjs.com/package/jsonwebtoken
 * */


/* GET home page. */
router.get(/(^\/$)|(^\/login$)/, function(req, res, next) {
    res.sendFile('login.html', {root: path.join(__dirname, '../public/login')});
});

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

router.get('/admin',function (req,res,next) {
    validateRoleAndSendFile(res,req.cookies.jwt,'ADMIN','forAdmin/admin.html');
});

router.get('/doe',function (req,res,next) {
    validateRoleAndSendFile(res,req.cookies.jwt,'DOE','/forAdmin/admin.html');
    // res.end('request doe page');
});

router.get('/pmc',function (req,res,next) {
    validateRoleAndSendFile(res,req.cookies.jwt,'PMC','forAdmin/admin.html');
    // res.end('request pmc page');
});

//TODO incompactable url with role Student -> STUD
router.get('/stud',function (req,res,next) {
    validateRoleAndSendFile(res,req.cookies.jwt,'STUD','forAdmin/admin.html');
    // res.end('request student page');
});

router.get('/reset',function (req,res,next) {
    res.sendFile('resetPassword.html',{root: path.join(__dirname, '../public/resetpassword')})
});


var validateRoleAndSendFile = function (res,cookie,role,file) {
    jwt.verify(cookie,config['JWT']['SECRET'],function (err,decode) {
        if (err) {
            console.log(err);
            res.redirect('/');
            res.end();
            return;
        }
        if (decode.role == role) {
            res.sendFile(file,{root: path.join(__dirname, '../public')});
        } else {
            res.redirect('/');
            res.end();
        }
    });
}


module.exports = router;
