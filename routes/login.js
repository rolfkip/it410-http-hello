var loginRoute = function(router) {
    router.route('/login')
        .post(function(req, res) {
            passport.authenticate('local',{},
            function(req, res) {
                res.send({"loggedIn":true})
            })
        });
    router.route('/logout')
        .get(function(req, res)) {
            req.logout();
            res.redirect('/');
        }
};
module.exports = loginRoute;