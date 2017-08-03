var LocalStrategy = require('passport-local').Strategy;
var pgdb = require('../query');

/*
{ error: duplicate key value violates unique constraint "login_pkey"
        at Connection.parseE (/Users/wjm-harry/Documents/MeiguoEdu/node_modules/pg/lib/connection.js:539:11)
        at Connection.parseMessage (/Users/wjm-harry/Documents/MeiguoEdu/node_modules/pg/lib/connection.js:366:17)
        at Socket.<anonymous> (/Users/wjm-harry/Documents/MeiguoEdu/node_modules/pg/lib/connection.js:105:22)
        at emitOne (events.js:96:13)
        at Socket.emit (events.js:188:7)
        at readableAddChunk (_stream_readable.js:176:18)
        at Socket.Readable.push (_stream_readable.js:134:10)
        at TCP.onread (net.js:548:20)
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
  line: '433',
  routine: '_bt_check_unique'
 }
 */
module.exports = new LocalStrategy(
    { passReqToCallback: true },
    function(req, username, password, done){
        return done(null);
        // db.none('INSERT INTO users(name, active) VALUES($1, $2)', ['John', true])
        //     .then(() => {
        //         // success;
        //     })
        //     .catch(function(error) {
        //         // error;
        //         return done(error);
        //     });
    }
);

