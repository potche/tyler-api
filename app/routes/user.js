/**
 * Router para gestión de usuarios
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 0.2.0
 * @module app/routes/user
 */

var users = require('../controllers/user');
var env = require('../../config/env');
var security = require('../../config/security');
var utils = require('../../config/utils');

var userRoutes = function(app){

    app.route(env.versionUrl+'/users')
        .get([security.grantAdmin],users.getAll)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/user/:_userId')
        .delete([security.grantAdmin],users.delete)
        .put([security.grantAdmin],users.update)
        .get([security.grantAdmin],users.readOne)
        .all(utils.handleNotAllowed);

    app.param('_userId',users.getByUserId);

    app.route(env.versionUrl+'/user/byUsername/:_username')
        .get([security.grantAdmin],users.readOne)
        .all(utils.handleNotAllowed);

    app.param('_username',users.getByUsername);

    app.route(env.versionUrl+'/user')
        .post([security.grantAdmin],users.create)
        .all(utils.handleNotAllowed);
};

module.exports = userRoutes;