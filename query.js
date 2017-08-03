/**
 * Created by wjm-harry on 7/25/17.
 */
var promise = require('bluebird');

var options = {
    promiseLib: promise
};

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
    createPuppy: createPuppy,
    updatePuppy: updatePuppy,
    test:test,
    createUser:createOneUser,
    testcreateOneUser:testcreateOneUser,

    getAllStudents: getallStudents,
    getAllStaffs: getallStaffs,
    createStudent:createStudent,
    removeStudent:removeOneStudent,
    // createStaff:createStaff,

    getOneStudent: getoneStudent,
    getOneStaff: getoneStaff,
    // getOneActivityRecord:getoneActivityRecord,

    getOneFromLogin:getoneFromLogin,
    passportValidator:PassportValidator,
};

function getoneFromLogin (req,res,next) {
    // console.log(req.cookies);
    console.log(req.params);
    var username = req.params.username;
    db.one('select * from login where username = $1',username)
        .then(function(data){
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

function PassportValidator (username,password,done) {
    console.log('this is passport validator',username,password,done);
    db.one('select * from login where username = $1',username)
        .then(function(user){
            console.log(user);
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            // if (!user.validPassword(password)) {
            //     return done(null, false, { message: 'Incorrect password.' });
            // }
            if (user.password != password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            console.log('validate success');
            return done(null, user);
        }).catch(function (err) {
            return done(err);
        })
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
    var stuID = req.params.id;
    db.one('select * from staff where id = $1',stuID)
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


function createPuppy(req, res, next) {
    req.body.age = parseInt(req.body.age);
    db.none('insert into pups(name, breed, age, sex)' +
        'values(${name}, ${breed}, ${age}, ${sex})',
        req.body)
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Inserted one puppy'
                });
        })
        .catch(function (err) {
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

function test(req,res,next) {
    var func1 = function () {
        console.log('1');
    }

    var func2 = function(err) {
        console.log('2');
        console.log(err);
    }
    testcreateOneUser(req,func1,func2);
}


function testcreateOneUser(req,thenCallBack,catchCallBack) {
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
    // console.log(req);
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

function updatePuppy(req, res, next) {
    db.none('update pups set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
        [req.body.name, req.body.breed, parseInt(req.body.age),
            req.body.sex, parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated puppy'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}


function removeOneStudent(req,res,next) {
    var stuID = req.body.id;
    console.log(stuID);
    if (!stuID) {
        res.status(400).json({
            status:'fail',
            message:'need student id'
        });
        return;
    }
    db.result('delete from student where id = $1',stuID)
        .then(function (result) {
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
    if (mode == 'student') {
        var date = new Date();
        out['id'] = util.md5(body.email);
        out['createdate'] = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
        out['bio'] = JSON.stringify(body);
        out['summary_bio'] = getsummaryString(body,mode);
        out['hours'] = '{0,0,0,0,0}';
        out['happi'] = '{0,0,0,0,0}';
        out['badges'] = '{"c1"}';

    } else if (mode == 'staff') {

    } else if (mode == 'newuser') {
        out['id'] = util.md5(body.username);
        out['username'] =body.username;
        out['role'] = body.role;
        out['password'] = body.password;
        out['isvisited'] = 0;
        out['nickname'] = '';
    }
    // ...more modes
    console.log(out);
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

    }
    // console.log(out);
    return JSON.stringify(out);
}