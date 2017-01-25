/**
 *
 * Módulo de funciones relacionadas con la seguridad de la información de la aplicación
 *
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 0.2.0
 * @module config/security
 *
 */

var async = require('async');
var jwt  = require('jwt-simple');
var encryption = require('./encryption');
var utils = require('./utils');
var applications = require('../app/models/application');
var request = require('request');

var security = {

    /**
     * Función que genera un token dado un objeto de aplicación
     *
     *
     * @function generateToken
     * @param application {object} Objeto de aplicación
     * @param days {Number} Días de expiración
     * @returns {{apiKey: String, expiring: Date, applicationId: (*|appsSchema.publicId|{type, unique, required}|string)}} Devuelve un objeto con el token, su fecha de expiración y el id público de la aplicación a utilizar para su futura autenticación
     */

    generateToken: function(application, days){

        var expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate()+days);


        var token = jwt.encode({

            expiring: expirationDate,
            applicationId: application.publicId,
            admin: application.superAdmin

        }, encryption.getSecret(), 'HS512');

        return ({

            _id: application._id,
            apiToken: token,
            expirationDate: expirationDate,
            applicationId: application.publicId
        });
    },

    /**
     *
     * Valida el id público y el password de una aplicación existente para efectos de generación de token.
     *
     * @private
     * @function validateApplication
     * @param applicationId {ObjectId} Id público de aplicación
     * @param applicationPassword {String} Password de aplicación
     * @param callback Función que maneja la respuesta obtenida
     */

    validateApplication: function(applicationId, applicationPassword, callback){

        applications.findOne({'publicId': applicationId, 'active': true}, function (err, app){

            if(!err && app !== null && encryption.decrypt(utils.base64Decode(app.adminPassword)) === applicationPassword){

                callback(app);
            }
            else{

                callback(false);
            }
        });

    },

    /**
     *
     * Función utilizada por la API para obtener las credenciales de acceso de una aplicación
     *
     * @function getCredentials
     * @param request {object} Objeto de petición
     * @param response {object} Objeto de respuesta http
     * @example
     * POST / HTTP 1.1
     * Raw:{
     *  'applicationId':'5bce74384893438cca',
     *  'applicationPassword': 'UA8A83849A384A3424942='
     * }
     */

    getCredentials: function(request,response){

        var applicationId = request.body.applicationId || '';
        var applicationPassword = request.body.applicationPassword || '';

        if(applicationId === '' || applicationPassword === ''){

            response.status(400);
            response.json(utils.getResponseFormat(400,'Application data is missing', null));
            return;
        }

        security.validateApplication(applicationId, utils.base64Decode(applicationPassword), function(app){

            if(!app){

                response.status(401);
                response.json(utils.getResponseFormat(401,"Wrong application id or password",null));
            }
            else{

                response.json(security.generateToken(app, 30));
            }
        });
    },

    /**
     *
     * Función para autenticar una petición por medio del token de acceso y verificación si la aplicación está activa.
     * @function authenticate
     *
     * @param request Petición
     * @param adminRequired Indica si es necesario validar que el token sea administrativo o no
     * @param callback Función para manejar el retorno de la función
     */

    authenticate: function(request, adminRequired, callback){

        var token = request.headers['x-access-token'];
        var jwtoken = security.decodeToken(token);

        if(jwtoken['error']){

            callback(jwtoken);
            return;
        }

        applications.findOne({'publicId': jwtoken.applicationId, 'active': true}, function (err, app) {

            if(err || !app){

                callback(utils.getResponseFormat(401,"Application is not active",null));
            }
            else{

                if (adminRequired && !jwtoken.admin){

                    callback(utils.getResponseFormat(403,'This application has no access to this endpoint',null));
                }

                else if (new Date(jwtoken.expiring) < Date.now()){

                    callback(utils.getResponseFormat(401,'Token has expired',null));
                }

                else callback(true);
            }
        });
    },

    /**
     *
     * Función para decodificar token
     *
     * @function decodeToken
     * @param token Token extraido de los headers
     * @returns {*} Devuelve el token decodificado (JSON) o en su caso devuelve un JSON para manejar la respuesta
     */

    decodeToken: function(token){

        try{

            return jwt.decode(token, encryption.getSecret());

        }catch(err){

            return utils.getResponseFormat(401,err.toString(),null);
        }
    },

    /**
     *
     * Función invocada desde los routers que intercepta la autenticación administrativa en las rutas y maneja el cursor para despachar la petición
     *
     * @function grantAdmin
     * @param request {object} Objeto de petición
     * @param response {object} Objeto de respuesta
     * @param next {object} Cursor para despachar la petición de acuerdo al router
     */

    grantAdmin: function(request,response,next){

        security.authenticate(request,true,function(result){

            if(result !== true){

                response.status(result.status);
                response.json(result);

            } else{

                next();
            }
        });
    },

    /**
     *
     * Función invocada desde los routers que intercepta la autenticación pública en las rutas y maneja el cursor para despachar la petición
     *
     * @function grantClient
     * @param request {object} Objeto de petición
     * @param response {object} Objeto de respuesta
     * @param next {object} Cursor para despachar la petición de acuerdo al router
     */

    grantClient: function(request,response,next){

        security.authenticate(request,false,function(result){

            if(result !== true){

                response.status(result.status);
                response.json(result);

            } else{

                next();
            }
        });
    },

    /**
     *
     * Decodifica el token para obtener el id de la aplicación
     *
     * @param jwtoken Token de autenticación de API
     * @returns {*}
     */

    getApplicationId: function (jwtoken) {

        var token = security.decodeToken(jwtoken);
        return token.applicationId;
    }
};

module.exports = security;