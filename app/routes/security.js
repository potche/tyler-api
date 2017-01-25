/**
 *
 *  Rutas para métodos de seguridad
 *
 *  @author Julio Bravo <jbravo@clb.unoi.com>
 *  @module app/routes/security
 *  @version 1.0.0
 *
 */

var security = require('../../config/security');
var env = require('../../config/env');

var securityRoutes = function(app){

    app.route(env.versionUrl+'/getCredentials')
        .post(security.getCredentials);

};

module.exports = securityRoutes;