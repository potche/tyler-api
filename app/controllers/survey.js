/**
 * Controlador para evaluaciones
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 0.1.0
 * @module app/controllers/survey
 */

var Survey = require('../models/survey');
var utils = require('../../config/utils');
var security = require('../../config/security');

var surveyController = {

    /**
     *
     * Creación de evaluación
     *
     * @function create
     * @param req {object} Objeto de petición
     * @param res {object} Objeto de respuesta
     * @example
     * POST / HTTP 1.1
     * tyler/v0/survey
     * Raw: {
     *  "title" : "prueba",
     *  "description" : "prueba",
     *  "instruction" :  "prueba",
     *  "createdBy" : 11111,
     *  "sections": [{
     *      "name" : "prueba",
     *      "sectionOrder": 1,
     *      "instruction" : "pruebe",
     *      "introduction" : "prueba",
     *      "value" : 2,
     *      "settings":[{
     *          "random" : true,
     *          "numQuestions" : 1,
     *      }],
     *      "questions":[{
     *          "questionId" : "56cf81cf370b5020498317d0",
     *          "value":5,
     *          "order":1
     *      }]
     *  }],
     *  "applicationId": "56cf81cf370b5020498317d5",
     *  "assignments" : [{
     *      "schools" : [1,2],
     *      "schoolPeriods" : [1],
     *      "schoolSubjects" : [5],
     *      "roles": [{
     *          "schoolLevel" : [1],
     *          "profile" : [1,2],
     *          "schoolGrades" : [2,3]
     *      }]
     *  }]
     * }
     *
     */

    create: function(req,res){

        var survey = new Survey(req.body);
        if(Object.keys(survey).length <= 0 || survey.sections.length <= 0){

            res.status(400);
            res.json(utils.getResponseFormat(400,'Could not find survey parameters',null));
            return;
        }

        survey.createDate = new Date();
        survey.modifyDate = survey.createDate;
        survey.applicationId = security.getApplicationId(req.headers['x-access-token']);
        survey.save(function(err){

            if(err){

                utils.handleDBError(err,res);
            }
            else{

                res.status(200);
                res.json(utils.getResponseFormat(200,null,survey._id));
            }
        });
    },

    readOne: function(req,res){

        res.json(req.survey);
    },

    /**
     * Devuelve una evaluación que corresponde al Id proporcionado
     *
     * @function getOneById
     * @param req {object} Objeto de petición
     * @param res {object} Objeto de respuesta HTTP
     * @param next {object} Refiere al middleware para entrega de un solo objeto
     * @example
     * GET / HTTP 1.1
     * tyler/v1/survey/55DDf86dbf8705054aa2f238
     */

    getOneById: function(req,res,next){

        Survey.findOne({_id: req.params._surveyId, "applicationId":security.getApplicationId(req.headers['x-access-token'])}, function(err,survey){

            if(err){

                utils.handleDBError(err,res);
            }
            else{

                if(!survey){

                    res.status(404);
                    res.json(utils.getResponseFormat(404,'Survey not found with given id',null));
                }
                else{

                    req.survey = survey;
                    next();
                }
            }
        }).populate( 'sections.questions.questionId' );
    },

    /**
     *
     * Obtiene un arreglo de evaluaciones de acuerdo al id del creador porporcionado
     *
     * @function getByCreator
     * @param req {object} Petición http
     * @param res {object} Respuesta http
     * @example
     * GET / HTTP 1.1
     * tyler/v1/surveys/byCreator/55DDf86dbf8705054aa2f238
     *
     */

    getByCreator: function(req,res){

        Survey.find({createdBy:req.params._creator, "applicationId":security.getApplicationId(req.headers['x-access-token'])}, function(err,surveys){

            if(err){

                utils.handleDBError(err,res);
            }
            else{

                if(typeof surveys === 'object' && surveys.length === 0){

                    res.status(404);
                    res.json(utils.getResponseFormat(404,'Surveys not found for this creator',null));
                }
                else{

                    res.status(200);
                    res.json(surveys);
                }
            }
        }).populate( 'sections.questions.questionId' );
    },
    /**
     *
     * Devuelve un arreglo de evaluaciones de acuerdo a los parámetos indicados
     *
     * @function getByAssignmentParams
     * @param req {object} Petición http
     * @param res {object} Respuesta http
     * @example
     * GET / HTTP 1.1
     *
     * tyler/v1/surveys/byPeriod/55DDf86dbf8705054aa2f238
     * tyler/v1/surveys/bySubject/55DDf86dbf8705054aa2f238
     * tyler/v1/surveys/bySchool/55DDf86dbf8705054aa2f238
     * tyler/v1/surveys/byGrade/55DDf86dbf8705054aa2f238
     * tyler/v1/surveys/byLevel/55DDf86dbf8705054aa2f238
     * tyler/v1/surveys/byProfile/55DDf86dbf8705054aa2f238
     */

    getByAssignmentParams: function(req,res){

        var paramKey = Object.keys(req.params)[0];
        var queryKey = paramKey.replace(/_/g,'.');

        var or1 = JSON.parse('{ "assignments.'+queryKey+'": "'+req.params[paramKey]+'"}');
        var or2 = paramKey === 'roles_profile' || paramKey === 'roles_schoolLevel' ? JSON.parse('{ "assignments.roles": [] }') : JSON.parse('{ "assignments.'+queryKey+'": []}');

        var query = { $and: [
            { $or: [ or1 , or2 ]},
            { applicationId: security.getApplicationId(req.headers['x-access-token'])}
        ]};

        Survey.find( query, function(err,surveys){

            if(err){

                utils.handleDBError(err,res);
            }
            else{

                if(typeof surveys === 'object' && surveys.length === 0){

                    res.status(404);
                    res.json(utils.getResponseFormat(404,'Surveys not found with given parameters',null));
                }
                else{

                    res.status(200);
                    res.json(surveys);
                }
            }
        }).populate( 'sections.questions.questionId' );
    },

    /**
     * Obtiene un conjunto de evaluaciones dado un rol especificado
     *
     * @function getByRole
     * @param req {object} Petición http
     * @param res {object} Respuesta http
     * @example
     * GET / HTTP 1.1
     *
     * tyler/v1/surveys/byRole/55DDf86dbf8705054aa2f238/55DDf86dbf8705054aa2f238
     */

    getByRole: function(req,res){

        Survey.find({ $and: [
                    { $or: [ { "assignments.roles.profile": req.params['profile'] }, { "assignments.roles": [] } ]},
                    { $or: [ { "assignments.roles.schoolLevel": req.params['schoolLevel'] }, { "assignments.roles": [] } ]},
                    { applicationId: security.getApplicationId(req.headers['x-access-token'])}
                ]}, function(err,surveys){

            if(err){

                utils.handleDBError(err,res);
            }
            else{

                if(typeof surveys === 'object' && surveys.length === 0){

                    res.status(404);
                    res.json(utils.getResponseFormat(404,'Surveys not found with given roles',null));
                }
                else{

                    res.status(200);
                    res.json(surveys);
                }
            }
        }).populate( 'sections.questions.questionId' );
    },

    /**
     * Obtiene un arreglo de evaluaciones de la aplicación desde donde se realiza la petición
     *
     * @function getAllByApplication
     * @param req {object} Petición http
     * @param res {object} Respuesta http
     * @example
     * GET / HTTP 1.1
     * tyler/v1/survey/55DDf86dbf8705054aa2f238
     *
     */

    getAllByApplication: function(req,res){

        Survey.find({"applicationId":security.getApplicationId(req.headers['x-access-token'])}, function(err,surveys){

            if(err){

                utils.handleDBError(err,res);
            }
            else{

                if(typeof surveys === 'object' && surveys.length === 0){

                    res.status(404);
                    res.json(utils.getResponseFormat(404,'Surveys not found',null));
                }
                else{

                    res.status(200);
                    res.json(surveys);
                }
            }
        }).populate( 'sections.questions.questionId' );
    },

    /**
     * Editar de evaluación
     * Función que permite la edición de una evaluación
     *
     * @function updateOne
     * @param req {object} Petición http
     * @param res {object} Respuesta http
     * @example
     * PUT / HTTP 1.1
     * tyler/v1/survey/55DDf86dbf8705054aa2f238
     * Raw: {
     * "title": "Evaluacion X-file",
     * "description": "Descripcion",
     * "instruction": "Instrucciones",
     * "active": true,
     * "sandbox": true,
     * "disableDate": "2015-12-28T12:23:00Z",
     * "modifiedBy": 111111,
     * "media": false,
     * "sectionRandom": false,
     * "sections":[{
     *  "name": "General",
     *  "sectionOrder": 1,
     *  "instruction": "Contesta las siguientes preguntas...",
     *  "introduction": "<img src='imagen.gif'",
     *  "value": 100.00,
     *  "settings":{
     *      "random": true,
     *      "numQuestions": 2,
     *  },
     *  "questions": [{
     *      "questionId": 123,
     *      "value": 33.33,
     *      "order": 1
     *      }]
     *  }]
     *  "assignments":[{
     *      "schools": [1209,1253],
     *      "schoolPeriods": [19],
     *      "schoolSubjects": [4],
     *      "roles":[{
     *          "schoolLevel": 16,
     *          "profile": [18],
     *          "schoolGrades": [3]
     *      }]
     *  }]
     *
     */

    updateOne: function(req,res){

        var survey = req.body;
        survey.applicationId = security.getApplicationId(req.headers['x-access-token']);
        survey.modifyDate = new Date();

        if(Object.keys(survey).length <= 0 || !survey['modifiedBy']){

            res.status(400);
            res.json(utils.getResponseFormat(400,'Required fields for survey update are missing',null));
            return;
        }

        Survey.findByIdAndUpdate(req.survey.id,survey,{new: true},function(err,survey){

            if(err){

                utils.handleDBError(err,res);
            }
            else{

                res.status(200);
                res.json({
                    'status': 200,
                    'message': 'Successfully updated',
                    'id': survey._id
                });
            }
        });
    },

    /**
     * Elimina una evaluación a través de su id
     *
     * @function delete
     * @param req {object} Petición http
     * @param res {object} Respuesta http
     * @example
     * DELETE/ HTTP 1.1
     * /tyler/v1/survey/55DDf86dbf8705054aa2f238
     */

    delete: function(req,res){

        req.survey.remove(function(err){

            if(err){

                utils.handleDBError(err,res);
            }
            else{

                res.status(200);
                res.json({
                    'status': 200,
                    'message': "Successfully deleted",
                    'id': req.survey._id
                });
            }
        });
    }
};

module.exports = surveyController;