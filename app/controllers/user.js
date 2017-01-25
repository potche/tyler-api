/**
 * Controlador para usuarios
 *
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 0.2.0
 * @module app/controllers/user
 *
 */

var User = require('../models/user');
var utils = require('../../config/utils');
var security = require('../../config/security');
var encryption = require('../../config/encryption');
var usernameMaxLength = 20;

var usersController = {

    /**
     *
     * Devuelve la lista de todos los usuarios del motor de evaluaciones.
     *
     *
     * @function getAll
     * @param request {object} Petición
     * @param response {object} Respuesta
     * @example
     * GET / HTTP 1.1
     * /tyler/v1/users
     */

    getAll: function(request,response){

        User.find(function(err, users){

            if(err){

                utils.handleDBError(err, response);

            }else{

                if (typeof(users) === 'object' && users.length === 0){

                    response.status(404);
                    response.json(utils.getResponseFormat(404,'Empty set',null));

                } else{

                    response.json(users);
                }
            }
        });
    },

    /**
     *
     * Creación de usuario
     *
     * @function create
     * @param request {object} Petición
     * @param response {object} Respuesta
     * @example
     * POST / HTTP 1.1
     * tyler/v0/user
     * Raw: {
     *  "publicId": 55DDf86dbf8705054aa2f238,
     *  "username": julzone,
     *  "isSuperAdmin": false,
     *  "active": true,
     *  "profileImgPath": "/img/55DDf86dbf8705054aa2f238_1.jpg"
     * }
     *
     */

    create: function(request,response){

        var user = new User(request.body);

        if( Object.keys(user).length === 0 || !usersController.isUserBodyValid(user)){

            response.status(400);
            response.json(utils.getResponseFormat(400,'Some user fields are missing or not required',null));
            return;
        }

        if(!usersController.validateUsernameLength(user.username)){

            response.status(400);
            response.json(utils.getResponseFormat(400,'Chosen username is too long, it must be 20 chars length maximum',null));
            return;
        }

        var passwd = encryption.getRandomToken(13);
        var encrypted = encryption.encrypt(passwd);
        user.password = utils.base64Encode(encrypted);
        user.registerDate = new Date();

        user.save(function (err){

            if(err) {

                utils.handleDBError(err, response);

            } else {

                response.status(200);
                response.json({
                    'status': 200,
                    'message': 'Successfully created',
                    'id': user._id,
                    'password': passwd
                });
            }
        });
    },

    /**
     *
     * Middleware para consultas
     *
     * @author Julio Bravo <jbravo@clb.unoi.com>
     * @module app/controllers/user
     * @param request {object} Petición
     * @param response {object} Respuesta
     *
     */

    readOne: function(request, response){

        response.json(request.user);
    },

    /**
     * Devuelve un usuario de acuerdo al id del usuario
     *
     * @function getByUserId
     * @param request {object} Petición
     * @param response {object} Respuesta
     * @param next {object} Cursor
     * @example
     * GET / HTTP 1.1
     * tyler/v1/user/55DDf86dbf8705054aa2f238
     */

    getByUserId: function(request,response,next){

        User.findOne({'_id': request.params._userId}, function (err,user){

            if(err){

                utils.handleDBError(err, response);
            }
            else{

                if(!user){

                    response.status(404);
                    response.json(utils.getResponseFormat(404,'User not found',null));
                }

                else{

                    request.user = user;
                    next();
                }
            }
        });
    },

    /**
     * Devuelve un usuario de acuerdo al username
     *
     * @function getByUsername
     * @param request {object} Petición
     * @param response {object} Respuesta
     * @param next {object} Cursor
     * @example
     * GET / HTTP 1.1
     * tyler/v1/user/55DDf86dbf8705054aa2f238
     */

    getByUsername: function(request,response,next){

        User.findOne({'username': request.params._username}, function (err,user){

            if(err){

                utils.handleDBError(err, response);
            }
            else{

                if(!user){

                    response.status(404);
                    response.json(utils.getResponseFormat(404,'User not found',null));
                }

                else{

                    request.user = user;
                    next();
                }
            }
        });
    },

    /**
     *
     * Actualiza los datos de un usuario registrado
     *
     * @function update
     * @param request {object} Petición
     * @param response {object} Respuesta
     * @example
     * PUT / HTTP 1.1
     * tyler/v1/user/55DDf86dbf8705054aa2f238
     * Raw:{
     *  "publicId": 55DDf86dbf8705054aa2f238,
     *  "isSuperAdmin": false,
     *  "active": true,
     *  "profileImgPath": "/img/55DDf86dbf8705054aa2f238_1.jpg"
     * }
     */

    update: function(request,response){

        if(!usersController.isUpdateValid(request.body)){

            response.status(400);
            response.json(utils.getResponseFormat(400,"Some user fields are not updateable or empty",null));
            return;
        }

        User.findByIdAndUpdate(request.user.id, request.body, {new: true}, function(err,user) {

            if(err) {

                utils.handleDBError(err, response);
            }
            else{

                response.status(200);
                response.json({
                    "status": 200,
                    "message": "Successfully updated",
                    "id": user._id
                });
            }
        });
    },


    /**
     *
     * Elimina un usuario por su id. Se requieren permisos administrativos para poder realizar esta operación
     *
     * @function delete
     * @param request {object} Petición
     * @param response {object} Respuesta
     * @example
     * DELETE / HTTP 1.1
     * tyler/v1/user/55DDf86dbf8705054aa2f238
     *
     */

    delete: function(request,response){

        request.user.remove(function(err){

            if(err){

                utils.handleDBError(err, response);
            }
            else {

                response.status(200);
                response.json({
                    'status': 200,
                    'message': 'Successfully deleted',
                    'id': request.user._id
                });
            }
        });
    },

    /**
     *
     * Método interno que valida el cuerpo de la petición para agregar un nuevo usuario
     *
     * @param body
     * @returns {*}
     */

    isUserBodyValid: function(body){

        return body["publicId"] && body['username'] && !body['password'];
    },

    /**
     *
     * Método interno que valida el cuerpo de la petición para actualizar un nuevo usuario
     *
     * @param body
     * @returns {*}
     */

    isUpdateValid: function(body){

        return Object.keys(body).length > 0 && !body['registerDate'] && !body['username'];
    },

    validateUsernameLength: function(username){

        return username.length <= usernameMaxLength;
    }
};

module.exports = usersController;