var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var yaml = require('js-yaml');
var fs = require('fs');
var path = require('path');
var pgdb = require('../query');

const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../config.yaml'), 'utf8'));

module.exports = new LocalStrategy(
    { passReqToCallback: true },
    function(req, username, password, done){
        bcrypt.hash(password, config['BCRYPT']['SALT_ROUND'], function (err, hash) {
            if(err) return done(err);
            req.body.password = hash;
            pgdb.createOneUserCB(req,
                () => {return done(null)},
                (err) => {
                    return done(err)
                }
            );
        });
    }
);

/*
This is an error for duplicate insertion
{ error: duplicate key value violates unique constraint "login_pkey"
  name: 'error',
  length: 215,
  severity: 'ERROR',
  code: '23505',
  detail: 'Key (id)=(b967e409-eb43-7131-7c18-728bb4414547) already exists.',
  hint: undefined,
  position: undefined,
  internalPosition: undefined,
  internalQuery: undefined,
  where: undefined,
  schema: 'public',
  table: 'login',
  column: undefined,
  dataType: undefined,
  constraint: 'login_pkey',
  file: 'nbtinsert.c',
  routine: '_bt_check_unique'
 }
 */