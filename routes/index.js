var healthRoute = function(router) {
    router.route('/')
        .get(function(req, res) {
            res.status(401);
            res.send();
        })
        .put(function(req, res) {
            res.status(401);
            res.send();
        })
        .delete(function(req, res) {
            res.status(401);
            res.send();
        })
};
module.exports = healthRoute;