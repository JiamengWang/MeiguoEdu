var express = require('express');
var passport = require('passport');
var validator = require('validator');
var router = express.Router();

router.post('/signup', function(req, res, next){
    const checkFormResult = checkForm('/signup', req.body);
    if(!checkFormResult.validate){
        return res.status(400).json({
            success: false,
            message: checkFormResult.message
        });
    }

    passport.authenticate('local-signup', function(err) {
        if (err) {
            console.log(err);
            //TODO DB duplicated username
            return res.status(400).json({
                success: false,
                message: err
            });
        }

        return res.status(200).json({
            success: true,
            message: 'signup success'
        });
    })(req, res, next);
});


router.post('/login', function(req, res, next){
    const checkFormResult = checkForm('/login', req.body);
    if(!checkFormResult.validate){
        return res.status(400).json({
            success: false,
            message: checkFormResult.message
        });
    }

    passport.authenticate('local-login', function(err, token, userInfo, needReset) {
        if (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                message: err
            });
        }

        if(needReset){
            //TODO learn how to use res.status(307) redirection
            return res.status(307).end();
        } else {
            return res.status(200).json({
                success: true,
                message: 'login success',
                token,
                userInfo
            });
        }
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

    if(route === '/signup'){
        if(!payload || !validator.isEmail(payload.username)){
            message += 'email format incorrect. ';
            validate = false;
        }
        if(!payload || !passwordRegex.test(payload.password)){
            message += 'password format incorrect. ';
            validate = false;
        }

        if(validate){
            message = route.substr(1) + " successful";
        }
    }

    return {
        message,
        validate
    }
}

module.exports = router;