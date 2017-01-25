/**
 * Router para evaluaciones
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 1.0.0
 * @module app/routes/survey
 */

var surveys = require('../controllers/survey');
var env = require('../../config/env');
var security = require('../../config/security');
var utils = require('../../config/utils');

var surveyRoutes= function(app){

    app.route(env.versionUrl+'/surveys')
        .get([security.grantClient],surveys.getAllByApplication)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/survey')
        .post([security.grantClient],surveys.create)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/survey/:_surveyId')
        .get([security.grantClient],surveys.readOne)
        .put([security.grantClient],surveys.updateOne)
        .delete([security.grantAdmin],surveys.delete)
        .all(utils.handleNotAllowed);

    app.param(['_surveyId'],surveys.getOneById);

    app.route(env.versionUrl+'/surveys/byCreator/:_creator')
        .get([security.grantClient],surveys.getByCreator)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/surveys/byRole/:schoolLevel/:profile')
        .get([security.grantClient],surveys.getByRole)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/surveys/byGrade/:schoolGrades')
        .get([security.grantClient],surveys.getByAssignmentParams)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/surveys/bySchool/:schools')
        .get([security.grantClient],surveys.getByAssignmentParams)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/surveys/byPeriod/:schoolPeriods')
        .get([security.grantClient],surveys.getByAssignmentParams)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/surveys/bySubject/:schoolSubjects')
        .get([security.grantClient],surveys.getByAssignmentParams)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/surveys/byLevel/:roles_schoolLevel')
        .get([security.grantClient],surveys.getByAssignmentParams)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/surveys/byProfile/:roles_profile')
        .get([security.grantClient],surveys.getByAssignmentParams)
        .all(utils.handleNotAllowed);
};

module.exports = surveyRoutes;