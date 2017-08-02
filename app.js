var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');

var api = require('./routes/v1');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./query.js');




var app = express();

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log('initialize: ',username,password,done);
        db.passportValidator(username,password,done)
    }
));

app.enable('trust proxy');
// app.use(session({
//     secret: 'recommand 128 bytes random string',
//     cookie: { maxAge: 5*60*1000},
//     resave: true,
//     saveUninitialized: true,
//     rolling:true
// }));

app.use(passport.initialize());
var localSignupStrategy = require('./passport/signup_local_strategy');
var localLoginStrategy = require('./passport/login_local_strategy');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(passport.initialize());
// app.use(passport.session());

// app.post('/logintest',
//     passport.authenticate('local', { failureRedirect: '/admin',
//         failureFlash: true }),
//     function (req,res) {
//         res.redirect('/admin');
//     });
app.use('/v1',api);
app.use('/', index);
// app.use('/users', users);
// app.use('/admin',admin);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
