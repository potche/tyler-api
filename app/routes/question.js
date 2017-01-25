/**
 *  Rutas para CRUD Question
 *
 *  @author Isra Rey
 *  @module app/routes/question
 *  @version 1.0.0
 *
 */

var question = require('../controllers/question');
var env = require('../../config/env');
var security = require('../../config/security');
var utils = require('../../config/utils');

var questionRoutes = function(app){

    app.route(env.versionUrl+'/question/')
        .post([security.grantClient], question.create)
        ;

    app.route(env.versionUrl+'/question/byId/:questionId')
        .get([security.grantClient], question.getById)
        ;

    app.route(env.versionUrl+'/questions/bySchool/:schoolId')
        .get([security.grantClient], question.getBySchool)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/questions/byGrade/:GradeId')
        .get([security.grantClient], question.getByGrade)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/questions/bySchoolPeriod/:schoolPeriodId')
        .get([security.grantClient], question.getBySchoolPeriod)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/questions/bySubject/:SubjectId')
        .get([security.grantClient], question.getBySubject)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/questions/byGradeSubject/:GradeId/:SubjectId')
        .get([security.grantClient], question.getByGradeSubject)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/questions/byRol/:profileId/:levelId')
        .get([security.grantClient], question.getByRol)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/question/publish/:questionId')
        .put([security.grantClient], question.updatePublish)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/question/:questionId')
        .put([security.grantClient], question.update)
        .delete([security.grantAdmin], question.delete)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/question/enable/:questionId')
        .put([security.grantClient], question.enable)
        .all(utils.handleNotAllowed);

    app.route(env.versionUrl+'/questions')
        .delete([security.grantAdmin], question.deleteAll)
        .all(utils.handleNotAllowed);

};

module.exports = questionRoutes;