var express = require('express');
var router = express.Router();
var db = require('../query.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' ,name:'wjm'});
});

router.get('/student',db.getAllStudents);
// router.get('/student',db.getStudentSummary);

router.get('/student/:id',db.getOneStudent);

router.get('/staff',db.getAllStaffs);
//router.get('/staff',db.getStaffSummary);

router.get('/staff/:id',db.getOneStaff);

// router.get('/login/:username',db.getOneFromLogin);

// router.get('/user',db.getAllStudents);
// router.post('/testuser',db.test);
router.post('/user',db.createUser);
router.post('/student',db.createStudent);
// router.post('/student/:student_id/todo',db.createStudentTodo);
router.post('/staff',db.createStaff);
// router.post('/staff/:staff_id/todo',db.createStaffTodo);

router.delete('/user/:username',db.removeUser);
// router.delete('/student/:student_id/todo/:todo_id',db.removeStudentTodo);
// router.delete('/staff/:staff_id/todo/:todo_id',db.removeStaffTodo);

module.exports = router;
