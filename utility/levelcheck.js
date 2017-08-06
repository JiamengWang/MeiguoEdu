/**
 * Created by wjm-harry on 8/5/17.
 */
var jwt = require('jsonwebtoken');
// var cert = fs.readFileSync('./private.key');
var cert = 'wjm';
// var db = require('../query.js');
var yaml = require('js-yaml');

const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../config.yaml'), 'utf8'));



module.exports = {
    check:CheckJWT,
}

function CheckJWT(req,res,next) {
    console.log('check',req.url);
    jwt.verify(req.cookies.jwt,cert,function (err,decode) {
        if(err) {
            console.log(err);
            res.end('JWT invalidate!');
            return;
        }
        req.who = decode.sub;
        console.log('JWT validate');
        return next();
    });

}