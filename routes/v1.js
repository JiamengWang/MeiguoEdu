var express = require('express');
var router = express.Router();
var db = require('../query.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' ,name:'wjm'});
});

router.get('/student',db.getAllStudents);
router.get('/student/:id',db.getOneStudent);
router.get('/staff',db.getAllStaffs);
router.get('/staff/:id',db.getOneStaff);
// router.get('/login/:username',db.getoneFromLogin);

// router.get('/user',db.getAllStudents);
router.post('/user',db.createUser);
router.post('/student',db.createStudent);

router.delete('/user',db.removeUser);

module.exports = router;
