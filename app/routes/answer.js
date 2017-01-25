/**
 * Router para respuestas
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 1.0.0
 * @module app/routes/answer
 */

var answers = require('../controllers/answer');
var env = require('../../config/env');
var security = require('../../config/security');
var utils = require('../../config/utils');

var answerRoutes = function(app){

    app.route(env.versionUrl+'/answer/:answerId')
        .get([security.grantClient],answers.readOne)
        .put([security.grantClient],answers.update)
        .delete([security.grantAdmin],answers.delete)
        .all(utils.handleNotAllowed);

    app.param(['answerId'],answers.getById);

    app.route(env.versionUrl+'/answer')
        .post([security.grantClient],answers.create)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/answer/bySurveyRespondant/:_survey/:_respondant')
        .get([security.grantClient],answers.getBySurveyPerson)
        .all(utils.handleNotAllowed);

    app.param(['survey', 'respondant'],answers.getBySurveyPerson);

    app.route(env.versionUrl+'/answers/bySurvey/:surveyId')
        .get([security.grantClient],answers.getBySurvey)
        .all(utils.handleNotAllowed);

    app.param(['surveyId'],answers.getBySurvey);

    app.route(env.versionUrl+'/answers/byRespondant/:respondantId')
        .get([security.grantClient],answers.getByRespondant)
        .all(utils.handleNotAllowed);

    app.param(['respondantId'],answers.getByRespondant);

};

module.exports = answerRoutes;