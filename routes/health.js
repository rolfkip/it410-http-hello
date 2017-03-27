var healthRoute = function(router) {
    router.route('/health')
        .get(function(req, res) {
            res.status(200);
            res.send();
        });
};
module.exports = healthRoute;