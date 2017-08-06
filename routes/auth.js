var express = require('express');
var passport = require('passport');
var validator = require('validator');
var router = express.Router();

router.post('/signup', function(req, res, next){
    const checkFormResult = checkForm('/signup', req.body);
    if(!checkFormResult.validate){
        return res.status(401).json({
            success: false,
            message: checkFormResult.message
        });
    }

    passport.authenticate('local-signup', function(err) {
        if (err) {
            console.log(err);
            // '23505' is duplicate email error in PostgreSQL
            if(err.code && err.code === '23505'){
                return res.status(401).json({
                    success: false,
                    message: 'this email is already taken.'
                });
            }

            return res.status(400).json({
                success: false,
                message: 'signup failed! please check error object.',
                error: err
            });
        }

        return res.status(200).json({
            success: true,
            message: 'signup success!'
        });
    })(req, res, next);
});


router.post('/login', function(req, res, next){
    const checkFormResult = checkForm('/login', req.body);
    if(!checkFormResult.validate){
        return res.status(400).json({
            success: false,
            message: checkFormResult.message,
            userInfo: req.body.username
        });
    }

    passport.authenticate('local-login', function(err, userInfo) {
        if(err) {
            console.log(err);
            if(err.message && (err.message === 'No data returned from the query.')){
                return res.status(401).json({
                    success: false,
                    message: 'login failed! invalid username or password.'
                });
            }
            return res.status(400).json({
                success: false,
                message: 'login failed! please check error object.',
                error: err
            });
        }

        if(userInfo.err){
            console.log(userInfo.err);
            return res.status(401).json({
                success: false,
                message: 'login failed! invalid username or password.',
            });
        }

        if(userInfo.needReset){
            return res.status(307).json({
                success: false,
                message: 'redirection',
                userInfo: userInfo
            });
            //TODO learn how to use res.status(307) redirection
            // return res.redirect(307,)
        }

        res.cookie('jwt', userInfo.token, {httpOnly: true});
        return res.status(200).json({
            success: true,
            message: 'login success!',
            userInfo: userInfo
        });

    })(req, res, next);
});

router.post('/password', function(req, res, next){
    const checkFormResult = checkForm('/password', req.body);
    if(!checkFormResult.validate){
        return res.status(401).json({
            success: false,
            message: checkFormResult.message
        });
    }

    passport.authenticate('local-reset-password', function(err, userInfo){
        // TODO
    })(req, res, next);
});

function checkForm(route, payload){
    let message = '';
    let validate = true;
    /*
       ^	The password string will start this way
       (?=.*[a-z])	The string must contain at least 1 lowercase alphabetical character
       (?=.*[A-Z])	The string must contain at least 1 uppercase alphabetical character
       (?=.*[0-9])	The string must contain at least 1 numeric character
       (?=.*[!@#\$%\^&\*])	The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict
       (?=.{8,})	The string must be eight characters or longer
     */
    let passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    if(!payload.username || !validator.isEmail(payload.username)){
        message += ' email format incorrect.';
        validate = false;
    }
    if(!payload.password || !passwordRegex.test(payload.password)){
        message += ' password format incorrect.';
        validate = false;
    }
    if(route=='/password' && (!payload.newPassword || !passwordRegex.test(payload.newPassword))){
        message += ' new password format incorrect.';
        validate = false;
    }

    if(validate){ message = route.substr(1) + " successful"; }
    return {
        message,
        validate
    }
}

module.exports = router;