/**
 *  Rutas para CRUD Category
 *
 *  @author Isra Rey
 *  @module app/routes/category
 *  @version 1.0.0
 *
 */

var category = require('../controllers/category');
var env = require('../../config/env');
var security = require('../../config/security');
var utils = require('../../config/utils');

var categoryRoutes = function(app){

    app.route(env.versionUrl+'/category/')
        .post([security.grantClient], category.createCategory)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/Categories')
        .get([security.grantClient], category.getAll)
        .delete([security.grantAdmin], category.deleteAll)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/category/:categoryId')
        .delete([security.grantAdmin], category.delete)
        .get([security.grantClient], category.getById)
        .all(utils.handleNotAllowed);

};

module.exports = categoryRoutes;