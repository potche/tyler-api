/**
 *
 * Controlador para aplicaciones
 *
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 1.0.0
 * @module app/controllers/application
 *
 */

var Application = require('../models/application');
var utils = require('../../config/utils');
var security = require('../../config/security');
var encryption = require('../../config/encryption');
var uuid = require('node-uuid');

var appsController = {

    /**
     *
     * Devuelve um listado o arreglo de todas las aplicaciones. Se requieren permisos administrativos para poder realizar esta operación.
     *
     * @function getAll
     * @param request {object} Petición
     * @param response {object} Respuesta
     * @example
     * GET / HTTP 1.1
     * /tyler/v1/applications
     */

    getAll: function(request,response) {

        Application.find(function(err,applications){

            if(err){

                utils.handleDBError(err, response);

            }else{

                if (typeof(applications) === 'object' && applications.length === 0){

                    response.status(404);
                    response.json(utils.getResponseFormat(404,'Empty set',null));

                } else{

                    response.json(applications);
                }
            }
        });
    },


    /**
     *
     * Crea una aplicación nueva. Se requieren permisos administrativos para poder realizar esta operación.
     *
     * @function create
     * @param request {object} Petición
     * @param response {object} Respuesta
     * @example
     * POST / HTTP 1.1
     * tyler/v1/application
     * Raw: {
        "applicationName": "Demo app",
        "active": true,
        "ssl": true
     * }
     */

    create: function(request,response){

        var application = new Application(request.body);

        if(!appsController.validateUpsertRequest(request)){

            response.status(400);
            response.json(utils.getResponseFormat(400,'Some application fields are not accepted',null));
            return;
        }

        var passwd = encryption.getRandomToken(13);
        var encrypted = encryption.encrypt(passwd);
        application.adminPassword = utils.base64Encode(encrypted);
        application.publicId = uuid.v4();

        application.save(function (err){

            if(err) {

                utils.handleDBError(err, response);

            } else {

                response.status(200);
                response.json({
                    'status': 200,
                    'message': 'Successfully registered',
                    '_id': application._id,
                    'applicationId': application.publicId,
                    'applicationPassword': utils.base64Encode(passwd)
                });
            }
        });
    },

    /**
     *
     * Middleware para consultas unitarias por parámetros
     *
     *
     * @author Julio Bravo <jbravo@clb.unoi.com>
     * @module app/controllers/application
     * @param request {object} Petición
     * @param response {object} Respuesta
     */

    readOne: function(request, response){

        response.json(request.application);
    },

    /**
     *
     * Devuelve una aplicación dado su identificador interno. Se requieren permisos administrativos para poder realizar esta operación
     *
     * @function getById
     * @param request {object} Petición
     * @param response {object} Respuesta
     * @param next {object} Cursor para invocar al middleware de consulta unitaria
     * @example
     * GET / HTTP 1.1
     * tyler/v1/application/55DDf86dbf8705054aa2f238
     */

    getById: function(request,response,next){

        Application.findOne(request.params, function (err,application){

            if(err){

                utils.handleDBError(err, response);
            }
            else{

                if(!application){

                    response.status(404);
                    response.json(utils.getResponseFormat(404,'Application not found',null));
                }

                else{

                    request.application = application;
                    next();
                }
            }
        });
    },

    /**
     * Actualiza los datos de una aplicación registrada. Se requieren permisos administrativos para poder realizar esta operación
     * @function update
     * @param request {object} Petición
     * @param response {object} Respuesta
     * @example
     * PUT / HTTP 1.1
     * tyler/v1/application/55DDf86dbf8705054aa2f238
     * Raw: {
        "applicationName": "Demo app nuevo nombre",
        "active": true,
        "ssl": false
     * }
     *
     */

    update: function(request,response){

        //Valido que la petición sea correcta
        if(Object.keys(request.body).length <= 0){

            response.status(400);
            response.json(utils.getResponseFormat(400,"No parameters have been given for updating element",null));
            return;
        }

        if(!appsController.validateUpsertRequest(request)){

            response.status(400);
            response.json(utils.getResponseFormat(400,"Some application fields are not updatable",null));
            return;
        }

        Application.findByIdAndUpdate(request.application.id, request.body, {new: true}, function(err,application) {

            if(err) {

                utils.handleDBError(err, response);
            }
            else{

                response.status(200);
                response.json({
                    "status": 204,
                    "message": "Successfully updated, new credentials generated",
                    "credentials": security.generateToken(application,31)
                });
            }
        });
    },

    /**
     *
     * Elimina una aplicación por su id. Se requieren permisos administrativos para poder realizar esta operación
     *
     * @function delete
     * @param request {object} Petición
     * @param response {object} Respuesta
     * @example
     * DELETE / HTTP 1.1
     * tyler/v1/application/55DDf86dbf8705054aa2f238
     */

    delete: function(request,response){

        request.application.remove(function(err){

            if(err){

                utils.handleDBError(err, response);
            }
            else {

                response.status(200);
                response.json({
                    'status': 204,
                    'message': 'Successfully deleted',
                    '_id': request.application._id
                });
            }
        });
    },

    /**
     *
     * Validación para no recibir campos vacíos en la petición o campos que no son editables
     *
     * @private
     * @function validateUpsertRequest
     * @param request {object} Petición
     * @returns {boolean} Devuelve si el body de la petición es válida o no
     *
     */

    validateUpsertRequest : function(request){

        return (!request.body.registerDate && !request.body._id && !request.body.adminPassword && !request.body.publicId);
    }

};
module.exports = appsController;