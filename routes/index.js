var express = require('express');
var router = express.Router();
// var session = require('express-session');


/* GET home page. */
router.get('/', function(req, res, next) {
    // res.render('index', { title: 'Express' ,name:'wjm'});
    console.log(req.session.visit);
    if (!req.session.visit) {
        req.session.visit = 0;
    }

    if (req.session.visit == 0) {
        res.end('this is your first time to login');
    } else {
        res.end('request login page '+req.session.visit);
    }
    req.session.visit = req.session.visit + 1;
});

router.get('/admin',function (req,res,next) {
    console.log(req.session.visit);
    req.session.visit += 1;
    res.end('request admin page');
});

router.get('/doe',function (req,res,next) {
    res.end('request doe page');
});

router.get('/pmc',function (req,res,next) {
    res.end('request pmc page');
});

router.get('/student',function (req,res,next) {
    res.end('request student page');
});





module.exports = router;
