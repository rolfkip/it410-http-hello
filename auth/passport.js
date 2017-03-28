var fs = require('fs');

module.exports = function(passport, Strategy){
    passport.use(new Strategy (
    function(username, password, cb) {
        var users;
        fs.readFile('./users.json', 'utf8', function(err, data) {
            if(err) throw err;
            users = JSON.parse(data);
        })
    }));
}