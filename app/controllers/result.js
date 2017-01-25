/**
 * Controlador para entrega masiva de resultados
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 1.0.0
 * @module app/controllers/result
 */

var Answer = require('../models/answer');
var utils = require('../../config/utils');
var security = require('../../config/security');
var mongo = require('mongoose').mongo;

var resultsController = {

    /**
     *
     * Método que devuelve un arreglo de resultados de acuerdo a los parámetros proporcionados
     *
     * @function getResults
     * @param req {object} Petición http
     * @param res {object} Respuesta http
     * @example
     * GET / HTTP 1.1
     *
     * /tyler/v1/results/bySurveySchool/56be0ec521665eea2b9290a0/56be0ec521665eea2b9290a1
     * /tyler/v1/results/bySurveyPeriod/56be0ec521665eea2b9290a0/56be0ec521665eea2b9290a2
     * /tyler/v1/results/bySurveySubject/56be0ec521665eea2b9290a0/56be0ec521665eea2b9290a3
     * /tyler/v1/results/bySurveyLevel/56be0ec521665eea2b9290a0/56be0ec521665eea2b9290a5
     * /tyler/v1/results/bySurveyProfile/56be0ec521665eea2b9290a0/56be0ec521665eea2b9290a4
     * /tyler/v1/results/bySurveyRole/56be0ec521665eea2b9290a0/56be0ec521665eea2b9290a4/56be0ec521665eea2b9290a4
     * /tyler/v1/results/bySurveyGroup/56be0ec521665eea2b9290a0/56be0ec521665eea2b9290a1/56be0ec521665eea2b9290a2/56be0ec521665eea2b9290a6
     */

    getResults: function(req,res){

        var parameters = resultsController.parseParameters(req);

        Answer.find( parameters, function(err,results){

            if(err){

                utils.handleDBError(err,res);
            }
            else{

                if(typeof results === 'object' && results.length === 0){

                    res.status(404);
                    res.json(utils.getResponseFormat(404,'Results not found with given parameters',null));
                }
                else{

                    res.status(200);
                    res.json(results);
                }
            }
        });
    },

    /**
     *
     * Método ocupado por el API de resultados para parsear los parámetros y construir el query.
     * Con esto nos evitamos duplicar código y construir endpoint por endpoint
     * @function parseParameters
     * @private
     * @param req {object} Petición http
     * @returns {object} Query document para hacer consulta
     */

    parseParameters: function(req){

        var query = { $and: [

            { "surveyId": mongo.ObjectId(req.params._resultSurvey)},
            { "respondant.applicationId": security.getApplicationId(req.headers['x-access-token'])}
        ]};

        for(var i = 1; i < Object.keys(req.params).length; i++){

            var key =  Object.keys(req.params)[i];
            var queryKey = key.replace(/_/g,'.');
            var obj = JSON.parse('{"'+queryKey+'":"'+req.params[key]+'"}');

            query.$and.push(obj);
        }
        return query;
    }
};

module.exports = resultsController;