var promise = require('bluebird');
var options = { promiseLib: promise };
var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/meiguoedu';
var db = pgp(connectionString);

var fs = require('fs');
var jwt = require('jsonwebtoken');
// var cert = fs.readFileSync('./private.key');
var cert = 'wjm';

var util = require('./utility/rawdataProcess');

// add query functions

module.exports = {
    getoneFromLogin:getoneFromLogin,
    getoneFromLoginCB:getoneFromLoginCB,
    createUser:createOneUser,
    createOneUserCB:createOneUserCB,

    getAllStudents: getallStudents,
    getAllStaffs: getallStaffs,
    createStudent:createStudent,
    removeUser:removeOneUser,
    // createStaff:createStaff,

    getOneStudent: getoneStudent,
    getOneStaff: getoneStaff,
    // getOneActivityRecord:getoneActivityRecord,
};

function getoneFromLogin (req,res,next) {
    // console.log(req.cookies);
    console.log(req.params);
    var username = req.params.username;
    db.one('select * from login where username = $1',username)
        .then(function(data){
            console.log(data);
            res.status(200).json(
                {
                    status:'success',
                    data:data,
                    message:'Retrieved one record from login'
                }
            );
        }).catch(function (err) {
        return next(err);
    })
}

function getoneFromLoginCB(req, thenCallBack, catchCallBack) {
    var username = req.body.username;
    db.one('select * from login where username = $1',username)
        .then(function(data) { thenCallBack(data); })
        .catch(function (err) { catchCallBack(err); })
}


function getallStudents(req,res,next) {
    console.log(req.cookies);
    db.any('select * from student')
        .then(function (data) {
            res.status(200).json(
                {
                    status:'success',
                    data:data,
                    message:'Retrieved ALL studentsInfo'
                }
            );
        }).catch(function (err) {
            return next(err);
    });
}

function getallStaffs(req,res,next) {
    db.any('select * from staff')
        .then(function (data) {
            res.status(200).json({
                status:'success',
                data:data,
                message:'retrieve All staffInfo'
            });
        }).catch(function (err) {
        return next(err);
    });
}

function getoneStudent(req,res,next) {
    console.log(req.params);
    // var stuID = parseInt(req.params.id);
    // console.log(stuID);
    var stuID = req.params.id;
    db.one('select * from student where id = $1',stuID)
        .then(function (data) {
            res.status(200).json({
                status: 'success',
                data: data,
                message: 'Retrieved ONE student'
            });
        }).catch(function (err) {
            console.log(err);
            return next(err);
    });
}

function getoneStaff(req,res,next) {
    var staffID = req.params.id;
    db.one('select * from staff where id = $1',staffID)
        .then(function (data) {
            res.status(200).json({
                status: 'success',
                data: data,
                message: 'Retrieved ONE staff'
            });
        }).catch(function (err) {
        return next(err);
    });
}

function createOneUser(req,res,next) {
        var data = standardizeIn(req.body,'newuser');
        console.log('in create login',data);
        db.none('insert into login (id,username,role,password,isvisited,nickname)'+
            'values(${id},${username},${role},${password},${isvisited},${nickname})',
            data)
            .then(function () {
                // we need to send email at here
                res.status(200)
                    .json({
                        status: 'success',
                        message: 'Inserted one user'
                    });
            }).catch(function (err) {
                console.log(err);
                return next(err);
            });
}

function createOneUserCB(req,thenCallBack,catchCallBack) {
    var data = standardizeIn(req.body,'newuser');
    console.log('in create login',data);
    db.none('insert into login (id,username,role,password,isvisited,nickname)'+
        'values(${id},${username},${role},${password},${isvisited},${nickname})',
        data)
        .then(
            thenCallBack
        ).catch(function (err) {
            catchCallBack(err);
    });
}


function createStudent(req,res,next) {
    /**behaviour: student biographical infotmation should existed in req.body
     * method: POST
     * note: insert record into student/relation tables
     *       this method will be called by survery parser when we receive input data
     * */
    console.log(req);
    db.none('insert into student (id,createdate,bio,hours,happi,badges,summary_bio)'+
        'values (${id},${createdate},${bio},${hours},${happi},${badges},${summary_bio})',standardizeIn(req.body,'student')
    ).then(function () {
        var id = util.md5(req.body.email);
        var rel = {};
        rel['id'] = id;
        rel['stu_id'] = id;
        db.none('insert into relation (id,stu_id) values' +
                '(${id},${stu_id})',rel
        ).then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Inserted one Student Bio'
                });
        }).catch(function (err) {
            console.log(err);
            return next(err);
        })
    }).catch(function (err) {
        console.log(err);
        return next(err);
    })
}

function createStaff(req,res,next) {
    /**behaviour: staff biographical information shoud existed in req.body
     * method: POST
     * note: only insert into staff table
     *       this method will be called by survery parser when we receive input data
     * */
    console.log(req.body);
    db.none('insert into staff (id,createdate,bio,relation_id,role,summary_bio)'+
        'values (${id},${createdate},${bio},${relation_id},${role},${summary_bio})',standardizeIn(req.body,'staff')
    ).then(function () {
        res.status(200)
            .json({
                status: 'success',
                message: 'Insert one Staff Bio'
            });
    }).catch(function (err) {
        console.log(err);
        return next(err);
    })
}

function createTodoCell(req,res,next) {

}

function updateRelation(req,res,next) {

}

function removeOneUser(req,res,next) {
    /** behaviour: based on email address, remove one user from a login table
     *              -- if it is student's email, we should also manually remove bio info from student information
     *              -- if it is staff's email, we should also manually remove bio info from staff information
     *  method: DELETE
     *  note: url should contains the target email address
     * */
    var username = req.params.username;
    if (!username) {
        res.status(400).json({
            status:'fail',
            message:'need username'
        });
        return;
    }
    db.one('delete from login where username = $1 returning *',username)
        .then(function (data) {
            var result = data;
            console.log(result);
            if (result.role == "Student") {
                removeOneStudent(result.id,res,next);
            } else {
                removeOneStaff(result.id,res,next);
            }
        }).catch(function (err) {
            return next(err);
    });
}

function removeOneStudent(stuID,res,next) {
    // var stuID = req.body.id;
    // console.log(stuID);

    res.status(200).json({
        status:'success',
        message:'Removed:'+result
    });

    // if (!stuID) {
    //     res.status(400).json({
    //         status:'fail',
    //         message:'need student id'
    //     });
    //     return;
    // }
    // db.result('delete from student where id = $1',stuID)
    //     .then(function (result) {
    //         console.log(result);
    //         res.status(200).json({
    //             status:'success',
    //             message:'Removed:'+result
    //         });
    //     }).catch(function (err) {
    //         return next(err);
    //     });
}

function removeOneStaff(staffID,res,next) {
    // var staffID = req.body.id;
    // console.log(staffID);
    if (!staffID) {
        res.status(400).json({
            status:'fail',
            message:'need staff id'
        });
        return;
    }
    db.result('delete from staff where id = $1',staffID)
        .then(function (result) {
            console.log(result);
            res.status(200).json({
                status:'success',
                message:'Removed:'+result
            });
        }).catch(function (err) {
            return next(err);
    });
}


// utility functions used for this database
function standardizeIn(body,mode) {
    // console.log(body);
    var out = {};
    var date = new Date();
    if (mode == 'student') {
        out['id'] = util.md5(body.email);
        out['createdate'] = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
        out['bio'] = JSON.stringify(body);
        out['summary_bio'] = getsummaryString(body,mode);
        out['hours'] = '{0,0,0,0,0}';
        out['happi'] = '{0,0,0,0,0}';
        out['badges'] = '{"c1"}';
    } else if (mode == 'staff') {
        out['id'] = util.md5(body.email);
        out['createdate'] = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
        out['bio'] = JSON.stringify(body);
        out['role'] = body.role;
        out['relation_id'] = '{}';
        out['summary_bio'] = getsummaryString(body,mode);
    } else if (mode == 'newuser') {
        out['id'] = util.md5(body.username);
        out['username'] =body.username;
        out['role'] = body.role;
        out['password'] = body.password;
        out['isvisited'] = 0;
        out['nickname'] = '';
    }
    // ...more modes
    // console.log(out);
    return out;
}

function getsummaryString(body,mode) {
    var out = {};
    if (mode == 'student') {
        out['chinese_name'] = body.chinese_name;
        out['family_name'] = body.family_name;
        out['given_name'] = body.given_name;
        out['english_name'] = body.english_name;
        out['gender'] = body.gender;
        out['birthcity'] = body.birthCity;
    } else if (mode == 'staff') {
        out['name'] = body.family_name+' '+body.given_name;
        out['gender'] = body.gender;
        out['preferred_name'] = body.preferred_name;
        out['email'] = body.email;
    }
    console.log(out);
    return JSON.stringify(out);
}