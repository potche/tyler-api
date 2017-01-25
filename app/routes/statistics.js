/**
 * Router para estadisticas
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 1.0.0
 * @module app/routes/statistics
 */

var stats = require('../controllers/statistics');
var env = require('../../config/env');
var security = require('../../config/security');
var utils = require('../../config/utils');

var statsRoutes = function(app){

    app.route(env.versionUrl+'/stats/volume/surveys')
        .get([security.grantAdmin],stats.surveysCreated)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/stats/volume/answers')
        .get([security.grantAdmin],stats.answersCreated)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/stats/volume/surveys/byTime/:surveyDate1/:surveyDate2')
        .get([security.grantAdmin],stats.surveysCreatedByTime)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/stats/volume/answers/byTime/:ansDate1/:ansDate2')
        .get([security.grantAdmin],stats.answersCreatedByTime)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/stats/volume/surveys/byApp/:survAppId')
        .get([security.grantAdmin],stats.surveysCreatedByApp)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/stats/volume/answers/byApp/:ansAppId')
        .get([security.grantAdmin],stats.answersCreatedByApp)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/stats/volume/questions/byType/:qtId')
        .get([security.grantAdmin],stats.questionsByQt)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/stats/volume/questions')
        .get([security.grantAdmin],stats.questionTypesInQuestions)
        .all(utils.handleNotAllowed);
};

module.exports = statsRoutes;