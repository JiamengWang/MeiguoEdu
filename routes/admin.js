/**
 * Created by wjm-harry on 7/18/17.
 */
var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('../query.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log(__dirname);
    res.sendFile('/Users/wjm-harry/Documents/MeiguoEdu/public/forAdmin/index.html');
});



module.exports = router;
