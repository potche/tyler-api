/**
 * Router para aplicaciones
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 1.0.0
 * @module app/routes/applications
 */

var applications = require('../controllers/application');
var env = require('../../config/env');
var security = require('../../config/security');
var utils = require('../../config/utils');

var applicationRoutes = function(app){

    app.route(env.versionUrl+'/applications')
        .get([security.grantAdmin],applications.getAll)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/application')
        .post([security.grantAdmin],applications.create)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/application/:_id')
        .delete([security.grantAdmin],applications.delete)
        .put([security.grantAdmin],applications.update)
        .get([security.grantAdmin],applications.readOne)
        .all(utils.handleNotAllowed);

    app.param('_id',applications.getById);
};

module.exports = applicationRoutes;