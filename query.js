/**
 * Created by wjm-harry on 7/25/17.
 */
var promise = require('bluebird');

var options = {
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/wjm';
var db = pgp(connectionString);

// add query functions

module.exports = {
    createPuppy: createPuppy,
    updatePuppy: updatePuppy,
    removePuppy: removePuppy,

    getAllStudents: getallStudents,
    getAllStaffs: getallStaffs,
    createStudent:createStudent,
    // createStaff:createStaff,

    getOneStudent: getoneStudent,
    getOneStaff: getoneStaff,
    // getOneActivityRecord:getoneActivityRecord,

};


function getallStudents(req,res,next) {
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

function createStudent(req,res,next) {
    db.none('insert into ')
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


function removePuppy(req, res, next) {
    var pupID = parseInt(req.params.id);
    db.result('delete from pups where id = $1', pupID)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Removed ${result.rowCount} puppy'
                });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
        });
}
