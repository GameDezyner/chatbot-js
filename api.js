var request = require('request');
exports.login = function(username,password,server,callback) {
    request.post(server + '/api.php?action=login&lgname=' + username + '&lgpassword=' + password + '&format=json',function(err, res, body) {
        request.post(server + '/api.php?action=login&lgname=' + username + '&lgpassword=' + password + '&lgtoken=' + JSON.parse(body).login.token + '&format=json',function(err, res, body) {
            console.log(body);
            callback();
        });
    });

};

