/**
 * Controlador para generación de estadísticas
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 1.0.0
 * @module app/controllers/result
 */

var Answer = require('../models/answer');
var Survey = require('../models/survey');
var Question = require('../models/question');
var utils = require('../../config/utils');
var mongo = require('mongoose').mongo;

var statsController = {

    /**
     * Obtiene el número de evaluaciones creadas por todas las aplicaciones que consumen el motor de evaluaciones
     *
     * @function surveysCreated
     * @param req {object} Objeto de petición
     * @param res {object} Objeto de respuesta http
     * @example
     * GET / HTTP 1.1
     * /v1/stats/volume/surveys
     *
     */

    surveysCreated: function (req, res) {

        Survey.aggregate(statsController.surveysGlobalAggregation(), function (err, stats) {

            statsController.handleStatResponse(err,stats,req,res);
        });
    },

    /**
     *
     * Obtiene el número de respuestas registradas por todas las aplicaciones que consumen el motor de evaluaciones
     *
     * @function answersCreated
     * @param req {object} Objeto de petición
     * @param res {object} Objeto de respuesta http
     * @example
     * GET / HTTP 1.1
     * /v1/stats/volume/answers
     *
     */

    answersCreated: function (req, res) {

        Answer.aggregate(statsController.answersGlobalAggregation(), function (err, stats) {

            statsController.handleStatResponse(err,stats,req,res);
        });
    },

    /**
     *
     * Obtiene la cantidad de evaluaciones creadas por un rango de tiempo en específico, dado en formato de fechas YYYY-MM-DD hh:mm:ss
     *
     * @function surveysCreatedByTime
     * @param req {object} Objeto de petición
     * @param res {object} Objeto de respuesta http
     * @example
     * GET / HTTP 1.1
     * /v1/stats/volume/surveys/byTime/2015-01-01/2016-06-30
     *
     */

    surveysCreatedByTime: function (req, res) {

        var time1 = new Date(req.params.surveyDate1).getTime();
        var time2 = new Date(req.params.surveyDate2).getTime();

        Survey.aggregate(statsController.surveysByTimeAggregation(time1,time2), function (err, stats) {

            statsController.handleStatResponse(err,stats,req,res);
        });
    },

    /**
     *
     * Obtiene la cantidad de respuestas registradas por un rango de tiempo en específico, dado en formato de fechas YYYY-MM-DD hh:mm:ss
     *
     * @function answersCreatedByTime
     * @param req {object} Objeto de petición
     * @param res {object} Objeto de respuesta http
     * @example
     * GET / HTTP 1.1
     * /v1/stats/volume/answers/byTime/2015-01-01/2016-06-30
     *
     */

    answersCreatedByTime: function (req, res) {

        var time1 = new Date(req.params.ansDate1).getTime();
        var time2 = new Date(req.params.ansDate2).getTime();

        Answer.aggregate(statsController.answersByTimeAggregation(time1, time2), function (err, stats) {

            statsController.handleStatResponse(err,stats,req,res);
        });
    },

    /**
     *
     * Obtiene la cantidad de evaluaciones creadas por una aplicación dado su id público (Darwin)
     *
     * @function surveysCreatedByApp
     * @param req {object} Objeto de petición
     * @param res {object} Objeto de respuesta http
     * @example
     * GET / HTTP 1.1
     * /v1/stats/volume/surveys/byApp/54bef382329bedf20c
     *
     */

    surveysCreatedByApp: function (req, res) {

        Survey.aggregate(statsController.surveysByAppAggregation(req.params.survAppId), function (err, stats) {

            statsController.handleStatResponse(err,stats,req,res);
        });
    },

    /**
     *
     * Obtiene la cantidad de respuestas registradas por una aplicación dado su id público (Darwin)
     *
     * @function answersCreatedByApp
     * @param req {object} Objeto de petición
     * @param res {object} Objeto de respuesta http
     * @example
     * GET / HTTP 1.1
     * /v1/stats/volume/answers/byApp/54bef382329932120c
     *
     */

    answersCreatedByApp: function (req, res) {

        Answer.aggregate(statsController.answersByAppAggregation(req.params.ansAppId), function (err, stats) {

            statsController.handleStatResponse(err,stats,req,res);
        });
    },

    /**
     *
     * Obtienen la cantidad de reactivos clasificados por tipo de reactivo
     *
     * @function questionTypesInQuestions
     * @param req {object} Objeto de petición
     * @param res {object} Objeto de respuesta http
     * @example
     * GET / HTTP 1.1
     * /v1/stats/volume/questions/
     */

    questionTypesInQuestions: function (req, res) {

        Question.aggregate(statsController.questionsGlobalByQTAggreg(), function (err, stats) {

            statsController.handleStatResponse(err,stats,req,res);
        });
    },

    /**
     *
     * Obtienen la cantidad de reactivos por tipo de reactivo dado
     *
     * @function questionsByQt
     * @param req {object} Objeto de petición
     * @param res {object} Objeto de respuesta http
     * @example
     * GET / HTTP 1.1
     * /v1/stats/volume/questions/byType/54bef382329932120c
     */

    questionsByQt: function (req, res) {

        Question.aggregate(statsController.questionsByQuestionTypeAggreg(req.params.qtId), function (err, stats) {

            statsController.handleStatResponse(err,stats,req,res);
        });
    },

    /**
     *
     * Agregación global para evaluaciones
     *
     * @private
     * @function surveysGlobalAggregation
     * @returns {object} Agregación para el query a ejecutar
     */

    surveysGlobalAggregation: function () {

        return [
            { $group:{ _id:"$applicationId", count:{ $sum:1 } } },
            { $project: {count: 1}}
        ];
    },

    /**
     *
     * Agregación global para respuestas
     *
     * @private
     * @function answersGlobalAggregation
     * @returns {object} Agregación para el query a ejecutar
     */

    answersGlobalAggregation: function () {

        return [
            { $group: { _id: "$respondant.applicationId", count: {$sum: 1} } },
            { $project: {count: 1} }
        ];
    },

    /**
     *
     * Agregación global para evaluaciones filtradas por tiempo
     *
     * @private
     * @function surveysByTimelAggregation
     *
     * @param date1 {Date} Fecha inicio
     * @param date2 {Date} Fecha término
     * @returns {object} Agregación para el query a ejecutar
     *
     */

    surveysByTimeAggregation: function (date1, date2) {

        return [

            { $match: { createDate: { $gte: new Date(date1), $lte: new Date(date2) } }},
            { $group: { _id: null, count: { $sum: 1 } }}
        ];
    },

    /**
     *
     * Agregación global para respuestas filtradas por tiempo
     *
     * @private
     * @function answersByTimeAggregation
     *
     * @param date1 {Date} Fecha inicio
     * @param date2 {Date} Fecha término
     * @returns {object} Agregación para el query a ejecutar
     */

    answersByTimeAggregation: function (date1, date2) {

        return [

            { $match: { registerDate: { $gte: new Date(date1), $lte: new Date(date2) } }},
            { $group: { _id: null, count: { $sum: 1 } }}
        ];
    },

    /**
     *
     * Agregación para evaluaciones filtradas por aplicación
     *
     * @private
     * @function surveysByAppAggregation
     * @param appId {string} Id de aplicación
     * @returns {object} Agregación para el query a ejecutar
     */

    surveysByAppAggregation: function (appId) {

        return [

            { $match: { 'applicationId': appId }},
            { $group: { _id: "$applicationId", count: { $sum: 1 } }}
        ];
    },

    /**
     *
     * Agregación para respuestas filtradas por aplicación
     *
     * @private
     * @function answersByAppAggregation
     * @param appId {string} Id de aplicación
     * @returns {object} Agregación para el query a ejecutar
     */

    answersByAppAggregation: function (appId) {

        return [

            { $match: { 'respondant.applicationId': appId }},
            { $group: { _id: "$respondant.applicationId", count: { $sum: 1 } }}
        ];
    },

    /**
     *
     * Agregación para reactivos filtrados por tipo
     *
     * @private
     * @function questionsByQuestionTypeAggreg
     * @param qtId {string} Id de tipo de reactivo
     * @returns {object} Agregación para el query a ejecutar
     */

    questionsByQuestionTypeAggreg: function(qtId){

        return[

            {$match: {questionTypeId: mongo.ObjectId(qtId)}},
            {$group: {_id: "$questionTypeId", count: {$sum: 1 }}}
        ];
    },

    /**
     *
     * Agregación para reactivos clasificados por tipo
     *
     * @private
     * @function questionsGlobalByQTAggreg
     * @returns {object} Agregación para el query a ejecutar
     */

    questionsGlobalByQTAggreg: function(){

        return[

            {$group: {_id: "$questionTypeId", count: {$sum: 1 }}}
        ];
    },

    /**
     *
     * Función global para manejar respuesta de DB, con esto evitamos duplicar código
     *
     * @function handleStatResponse
     * @param err {object} Objeto de error de DB
     * @param stats {array} Respuesta del query
     * @param req {object} Petición http
     * @param res {object} Respuesta http
     */

    handleStatResponse: function(err,stats,req,res){

        if (err) {

            utils.handleDBError(err, res);

        } else {

            if(stats.length <= 0){

                res.status(404);
                res.json(utils.getResponseFormat(404,'Could not find any statistics'));
            }
            else{

                res.status(200);
                res.json(stats);
            }
        }
    }
};

module.exports = statsController;