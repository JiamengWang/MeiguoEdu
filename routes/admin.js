/**
 * Created by wjm-harry on 7/18/17.
 */
var express = require('express');
var router = express.Router();
var session = require('express-session');

/* GET users listing. */
router.get('/', function(req, res, next) {
    // console.log(__dirname);
    res.sendFile('/Users/wjm-harry/IdeaProjects/nodejstest/public/forAdmin/index.html');
});

router.get('/test',function (req,res,next) {
    res.send('this is a test');
});

module.exports = router;
