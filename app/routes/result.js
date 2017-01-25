/**
 * Router para resultados
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 1.0.0
 * @module app/routes/result
 */

var results = require('../controllers/result');
var env = require('../../config/env');
var security = require('../../config/security');
var utils = require('../../config/utils');

var answerRoutes = function(app){

    app.route(env.versionUrl+'/results/bySurveySchool/:_resultSurvey/:respondant_schoolId')
        .get([security.grantClient],results.getResults)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/results/bySurveyPeriod/:_resultSurvey/:respondant_schoolPeriod')
        .get([security.grantClient],results.getResults)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/results/bySurveySubject/:_resultSurvey/:respondant_scholarity_schoolSubject')
        .get([security.grantClient],results.getResults)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/results/bySurveyLevel/:_resultSurvey/:respondant_scholarity_schoolLevel')
        .get([security.grantClient],results.getResults)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/results/bySurveyRole/:_resultSurvey/:respondant_scholarity_schoolLevel/:respondant_scholarity_schoolRole')
        .get([security.grantClient],results.getResults)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/results/bySurveyScholarity/:_resultSurvey/:respondant_scholarity_schoolLevel/:respondant_scholarity_schoolRole/:respondant_scholarity_schoolGrade')
        .get([security.grantClient],results.getResults)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/results/bySurveyGroup/:_resultSurvey/:respondant_schoolId/:respondant_scholarity_schoolGrade/:respondant_scholarity_schoolGroup')
        .get([security.grantClient],results.getResults)
        .all(utils.handleNotAllowed);
};

module.exports = answerRoutes;