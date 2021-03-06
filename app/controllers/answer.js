/**
 * Controlador para respuestas
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 1.0.0
 * @module app/controllers/answer
 */

var Answer = require('../models/answer');
var utils = require('../../config/utils');
var security = require('../../config/security');
var mongo = require('mongoose').mongo;

var answersController = {

    /**
     *
     * Creación de una respuesta
     *
     * @function create
     * @param request {object} Objeto de petición
     * @param response {object} Objeto de respuesta http
     * @example
     * POST / HTTP 1.1
     * tyler/v0/answer
     * Raw: {
        "respondantId": 1010722,
        "surveyId": 1,
        "timeSpent": 6000,
        "sections":[{
            "value": 100.00,
            "answers":[{
            "questionId": 1,
            "correctOptionType": "truefalse",
            "correctOptions": 1,
            "value": 70.00,
            "options":[{

                "option": "Sí",
                "value": "1"
                }]
            },
            {
            "questionId": 2,
            "correctOptionType": "quantitative",
            "correctOptions": 1,
            "value": 30.00,
            "maxVal":4,
            "options":[{

                "option": "No lo hago",
                "value": "0"
                }]
            }]
        }]
    * }
    *
    */

    create: function(request,response){

        var answer = new Answer(request.body);

        if(Object.keys(answer).length <= 0 || !answersController.validateCreation(answer)) {

            response.status(400);
            response.json(utils.getResponseFormat(400,'Some mandatory fields are missing',null));
            return;
        }

        if(answersController.calculateOverallScore(answer) !== true){

            response.status(400);
            response.json(utils.getResponseFormat(400,'Error while evaluating answer',null));
            return;
        }

        answer.attempts = 1;
        answer.registerDate = new Date();
        answer.lastUpdateDate = answer.registerDate;
        answer.respondant.applicationId = security.getApplicationId(request.headers['x-access-token']);
        answer.save(function (err){

            if(err) {

                utils.handleDBError(err, response);

            } else {

                response.status(200);
                response.json(utils.getResponseFormat(200,null,answer._id));
            }
        });
    },

    validateCreation: function(answerObj){

        return answerObj['surveyId'] && answerObj['respondant'] && answerObj.sections.length > 0;
    },

    /**
     *
     * Middleware para consultas unitarias
     *
     * @param request {object} Objeto de petición
     * @param response {object} Objeto de respuesta http
     */

    readOne: function(request, response){

        response.json(request.answer);
    },

    /**
     *
     * Devuelve una respuesta a través de su identificador interno
     *
     * @function getById
     * @param request {object} Objeto de petición
     * @param response {object} Objeto de respuesta http
     * @param next {object} Cursor para invocar al middleware de consulta unitaria
     * @param id {ObjectId} identificador interno de la respuesta
     * @example
     * GET / HTTP 1.1
     * tyler/v1/answer/55DDf86dbf8705054aa2f238
     */

    getById: function(request,response,next,id){

        Answer.findOne({_id: id, "respondant.applicationId":security.getApplicationId(request.headers['x-access-token'])}, function (err,answer){

            if(err){

                utils.handleDBError(err, response);
            }
            else{

                if(!answer){

                    response.status(404);
                    response.json(utils.getResponseFormat(404,'Answer object not found',null));
                }
                else{

                    request.answer = answer;
                    next();
                }
            }
        });
    },

    /**
     * Devuelve un arreglo de respuestas de acuerdo al id de la evaluación
     *
     * @function getBySurvey
     * @param request {object} Objeto de petición
     * @param response {object} Objeto de respuesta HTTP
     * @example
     * GET / HTTP 1.1
     * tyler/v1/answers/bySurvey/55DDf86dbf8705054aa2f238
     */

    getBySurvey: function(request,response) {

        Answer.find({"surveyId": mongo.ObjectId(request.params.surveyId), "respondant.applicationId":security.getApplicationId(request.headers['x-access-token'])},function(err,answers){

            if(err){

                utils.handleDBError(err, response);

            }else{

                if (typeof(answers) === 'object' && answers.length === 0){

                    response.status(404);
                    response.json(utils.getResponseFormat(404,'Nothing found for this survey',null));

                } else{

                    response.status(200);
                    response.json(answers);
                }
            }
        });
    },

    /**
     * Devuelve un arreglo de respuestas de acuerdo al id de la persona que responde
     *
     * @function getByRespondant
     * @param request {object} Objeto de petición
     * @param response {object} Objeto de respuesta HTTP
     * @example
     * GET / HTTP 1.1
     * tyler/v1/answers/byRespondant/1010722
     */

    getByRespondant: function(request,response) {

        Answer.find({'respondant.respondantId': request.params.respondantId, "respondant.applicationId":security.getApplicationId(request.headers['x-access-token'])},function(err,answers){

            if(err){

                utils.handleDBError(err, response);

            }else{

                if (typeof(answers) === 'object' && answers.length === 0){

                    response.status(404);
                    response.json(utils.getResponseFormat(404,'Nothing found for this respondant',null));

                } else{

                    response.json(answers);
                }
            }
        });
    },


    /**
     * Devuelve un arreglo de respuestas a través del id de la persona y de la evaluación
     *
     * @function getBySurveyPerson
     * @param request {object} Objeto de petición
     * @param response {object} Objeto de respuesta http
     * @example
     * GET / HTTP 1.1
     * tyler/v1/answer/bySurveyRespondant/55DDf86dbf8705054aa2f238/1010722
     */

    getBySurveyPerson: function(request,response){

        Answer.find({"surveyId": request.params._survey, "respondant.respondantId": request.params._respondant, "respondant.applicationId":security.getApplicationId(request.headers['x-access-token'])}, function(err,answers){

            if(err){

                utils.handleDBError(err, response);
            }
            else{

                if(answers === null || answers.length <= 0){

                    response.status(404);
                    response.json(utils.getResponseFormat(404,'Answers not found with these parameters',null));
                    return;
                }
                response.json(answers);
            }
        });
    },

    /**
     *
     * Actualiza los datos de una respuesta registrada
     *
     * @function update
     * @param request {object} Objeto de petición
     * @param response {object} Objeto de respuesta
     * @example
     * PUT / HTTP 1.1
     * tyler/v1/answer/55DDf86dbf8705054aa2f238
     * Raw: {
        "updatedBy": 1010722,
        "timeSpent": 6000,
        "sections":[{
            "value": 100.00,
            "answers":[{
            "questionId": 1,
            "correctOptionType": "truefalse",
            "correctOptions": 1,
            "value": 70.00,
            "options":[{

                "option": "Sí",
                "value": "1"
                }]
            },
            {
            "questionId": 2,
            "correctOptionType": "quantitative",
            "correctOptions": 1,
            "value": 30.00,
            "maxVal":4,
            "options":[{

                "option": "No lo hago",
                "value": "0"
                }]
            }]
        }]
     *}
     *
     */

    update: function(request,response){

        var answer = request.body;

        if(Object.keys(answer).length <= 0){

            response.status(400);
            response.json(utils.getResponseFormat(400,'No data provided to perform an answer update',null));
            return;

        }

        var validation = answersController.onUpdateValidate(answer);

        if(validation !== true){

            response.status(validation.status);
            response.json(utils.getResponseFormat(validation.status,validation.error,null));
            return;
        }

        var updateObj = { $set: answer, $inc: {'attempts':1}};
        answer.lastUpdateDate = new Date();

        Answer.findByIdAndUpdate(request.answer.id, updateObj, function(err,answer) {

            if(err) {

                utils.handleDBError(err, response);
            }
            else{

                response.status(200);
                response.json({
                    'status': 200,
                    'message': 'Successfully updated',
                    'id': answer._id
                });
            }
        });
    },

    /**
     *
     * Elimina una respuesta por su id. Se requieren permisos administrativos para poder realizar esta operación
     *
     * @function delete
     * @param request {object} Objeto de petición
     * @param response {object} Objeto de respuesta http
     * @example
     * DELETE / HTTP 1.1
     * tyler/v1/answer/55DDf86dbf8705054aa2f238
     */

    delete: function(request,response){

        request.answer.remove(function(err){

            if(err){

                utils.handleDBError(err, response);
            }
            else {

                response.status(200);
                response.json({
                    'status': 200,
                    'message': 'Successfully deleted',
                    'id': request.answer._id
                });
            }
        });
    },

    /**
     *
     * Validación de parámetros ejecutada al momento de actualizar un objeto de respuesta
     *
     * @private
     * @function onUpdateValidate
     * @param answerObj {object} Objeto de respuesta a validar antes de una actualización
     * @returns {*}  Devuelve un objeto de error en caso de no hallar los parámetros requeridos para actualizar o true en caso de que la validación sea correcta
     */

    onUpdateValidate: function(answerObj){

        if(answerObj.surveyId || answerObj.respondant || !answerObj["updatedBy"]){

            return utils.getResponseFormat(400,'Some parameters sent are non editable or some mandatory fields are missing',null);
        }

        if(answerObj.registerDate || answerObj.lastAttemptDate || answerObj.lastUpdateDate){

            return utils.getResponseFormat(400,'Control dates are not editable',null);
        }

        delete answerObj['attempts'];
        return answersController.calculateOverallScore(answerObj);
    },

    /**
     *
     * Calcula el score de la evaluación y valida que los campos mínimos requeridos para evaluar y almacenar las respuestas estén contenidos
     *
     * @private
     * @function calculateOverallScore
     * @param answerObj {object} Objeto que contiene las respuestas
     * @returns {*} Devuelve true si se calculó correctamente el score, de lo contrario devuelve un objeto de error.
     */

    calculateOverallScore: function(answerObj){

        var sections = !answerObj.sections || answerObj.sections.length === 0 ? '': answerObj.sections;
        var score = 0;
        var result;

        if(sections === ''){

            return(utils.getResponseFormat(400,'No sections specified',null));
        }

        for(var i = 0; i < sections.length; i++){

            result = answersController.getSectionScore(sections[i]);

            if (result['error']){

                return result;
            }

            sections[i].score = result;
            score += result;
        }

        answerObj.score = score.toFixed(1);

        return true;
    },

    /**
     *
     * Obtiene el score de una sección dada con preguntas
     *
     * @private
     * @function getSectionScore
     * @param section {object} Sección de la cual se toman sus reactivos y se obtiene su score
     * @returns {*} Devuelve el score numérico de la sección. De lo contrario, devuelve un objeto con el error generado.
     */

    getSectionScore: function(section){

        var answers = section['answers'] && section.answers.length > 0 ? section.answers : '';
        var sectionScore;
        var scoreSum = 0;
        var result;

        if(answers === ''){

            return utils.getResponseFormat(400,'No answers given',null);
        }

        for(var i = 0; i< answers.length; i++){

            result = answersController.getAnswerScore(answers[i]);

            if(result['error']){

                return result;
            }

            scoreSum += result;
            answers[i].score = result;
        }

        sectionScore = (scoreSum * section.value) / 100;

        return sectionScore;
    },

    /**
     *
     * Obtiene el score de un reactivo con opciones dadas perteneciente a una sección.
     *
     * @private
     * @function getAnswerScore
     * @param answer {object} Respuesta a un reactivo que contiene todas las opciones seleccionadas
     * @returns {*} Devuelve un número con el score del reactivo. De haber errores, devuelve un objeto de error.
     */

    getAnswerScore: function(answer){

        var answerScore;
        var correctOptions= 0;
        var points = 0;
        var options = answer['options'] && answer.options.length > 0 ? answer.options : '';

        if(options === ''){

            return utils.getResponseFormat(400,'No options provided',null);
        }

        for(var i = 0; i< options.length; i++){

            if(!options[i]['value'] || !options[i]['option']){

                return utils.getResponseFormat(400,'An option is not specified properly',null);
            }

            correctOptions += answersController.qualifyOption(answer.correctOptionType,options[i]);
            points += correctOptions;
        }

        answerScore= answersController.validateAnswerScore(answer,correctOptions,points, options.length);

        return answerScore;
    },

    /**
     *
     * Califica una opción de una pregunta dada, se obtiene si la opción seleccionada contabiliza o no para que la respuesta sea correcta
     *
     * @private
     * @function qualifyOption
     * @param type {String} Tipo de reactivo a calificar (de relación, verdadero/falso o cuantitativo/rúbrica)
     * @param option {object} Objeto de opción a calificar
     * @returns {number} Devuelve el resultado de la evaluación segun el tipo de reactivo (1 es correcto, 0 es incorrecto)
     *
     */

    qualifyOption: function(type, option){

        var result;

        switch (type){

            case 'matching':

                result = answersController.getComparisonScore(option);
                break;

            case 'truefalse':
            case 'quantitative':

                result = answersController.getQuantitativeScore(option);
                break;

            default:

                result = 0;
                break;
        }

        return result;
    },

    /**
     *
     * Maneja el tipo de respuesta de comparación. Toma el valor de la opción, y lo compara con el valor dado como respuesta. Se emplea cuando el correctOptionType es matching.
     *
     * @private
     * @function getComparisonScore
     * @param option {object} Objeto de tipo de respuesta matching a calificar
     * @returns {number} Devuelve 0 si la opción seleccionada no es correcta, y 1 si es correcta.
     *
     */

    getComparisonScore: function(option){

        return option['answerGiven'] && option.answerGiven.toLowerCase() === option.value.toLowerCase() ? 1 : 0;
    },

    /**
     * Obtiene el valor de opción seleccionada
     *
     * @function getQuantitativeScore
     * @param option {object} Objeto de opción de tipo quantitative (Rúbrica) o truefalse (Falso / Verdadero) a calificar.
     * @returns {Number} Devuelve 0 o 1 numérico en caso de ser una opción truefalse, y el valor numérico de la opción dada si se trata de una opción quantitative (rúbrica)
     *
     */

    getQuantitativeScore: function(option){

        return parseInt(option.value);
    },

    /**
     *
     * Realiza las ponderaciones necesarias para obtener el score del reactivo
     *
     * @param answer {object} Objeto de la respuesta
     * @param correctOptions {Number} Valor que indica el número de opciones correctas registradas
     * @param points {Number} Valor que indica el número de puntos acumulados en el caso de rúbricas u opciones cuantitativas
     * @returns {number} Devuelve el score del reactivo ponderado de acuerdo al valor o peso que posee en la sección
     */

    validateAnswerScore: function (answer,correctOptions,points, optionsGiven){

        var score;

        if(answer.correctOptionType === 'quantitative'){

            score = answer['maxVal'] && answer.maxVal > 0 ? (points / answer.maxVal) * answer.value : 0;
        }

        else{

            score = !answer['correctOptions'] || answer.correctOptions !== correctOptions || answer.correctOptions !== optionsGiven ? 0: answer.value;
        }

        return score;
    }
};

module.exports = answersController;