/**
 * Created by wjm-harry on 7/28/17.
 */
var crypto = require('crypto');

var MD5 = function(data) {
    return crypto.createHash('md5').update(data).digest("hex")+'';
}

var toipV4 = function(data) {
    if (typeof (data) == 'string') {
        return data.replace(/::ffff:/g,'');
    }
    return NaN;
};

module.exports = {
    md5:MD5,
    ipv4:toipV4,
}