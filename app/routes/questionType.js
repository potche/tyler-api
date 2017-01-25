/**
 *  Rutas para CRUD QuestionType
 *
 *  @author Isra Rey
 *  @module app/routes/questionType
 *  @version 1.0.0
 *
 */

var questionType = require('../controllers/questionType');
var env = require('../../config/env');
var security = require('../../config/security');
var utils = require('../../config/utils');

var questionTypeRoutes = function(app){

    app.route(env.versionUrl+'/questionType')
        .post([security.grantAdmin], questionType.create)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/questionTypes')
        .get([security.grantClient], questionType.getAll)
        .delete([security.grantAdmin], questionType.deleteAll)
        .all(utils.handleNotAllowed);


    app.route(env.versionUrl+'/questionType/:questionTypeId')
        .delete([security.grantAdmin], questionType.delete)
        .get([security.grantClient], questionType.getById)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/questionTypes/batch')
        .post([security.grantAdmin], questionType.createBatch)
        .all(utils.handleNotAllowed);
};

module.exports = questionTypeRoutes;