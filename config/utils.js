/**
 * Utilidades de codificación, de peticiones y respuestas para ser ocupadas en cualquier parte del proyecto.
 *
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 1.0.0.
 * @module config/utils
 */

// En esta variable manejo los mensajes de respuesta de acuerdo al estatus dado, para fines de uniformidad en las respuestas.
var statusEnum = {
    200: "Successfully created",
    204: "Successfully updated",
    400: "Bad Request. Please review API Reference",
    401: "Authorization failed",
    403: "Endpoint not allowed",
    404: "Resource not found",
    405: "Method not allowed",
    409: "Update conflict. Update cancelled",
    500: "Internal error. Operation has failed"
};

var utils = {

    /**
     *
     * Middleware para manejo de respuestas de acuerdo al status con base en la especificación de la W3C
     *
     * @function getResponseFormat
     * @param status {Number} Estatus de la respuesta a entregar
     * @param error {object} Error obtenido
     * @param id {ObjectId} Identificador del objeto creado / actualizado / eliminado
     * @returns {{status: *, message: *, error: string}} Devuelve un objeto con estatus, mensaje de acuerdo al estatus, y error si está disponible.
     */

    getResponseFormat: function (status, error, id) {

        return {

            'status': status,
            'message': statusEnum[status],
            'error': (error != null ? error : undefined),
            'id': (id != null ? id : undefined)
        };
    },

    /**
     *
     * Manejo de errores de mongoose
     *
     * @function handleDBError
     * @param error {object} Error de mongoose
     * @param response {object} Objeto de respuesta
     * @version 1.0.0
     */

    handleDBError: function(error,response){

        response.status(400);
        response.json(utils.getResponseFormat(400,error,null));
    },

    /**
     *
     * Middleware para manejar métodos no configurados en las rutas
     *
     * @function handleNotAllowed
     *
     * @param request {object} Petición
     * @param response {object} Response
     */

    handleNotAllowed: function (request,response){

        response.status(405);
        response.json(utils.getResponseFormat(405,null,null));
    },

    /**
     *
     * Codificación de texto en Base64
     *
     * @function base64Encode
     * @param text {string} Cadena a codificar
     * @returns {string} Cadena codificada en Base64
     * @see https://es.wikipedia.org/wiki/Base64
     */

    base64Encode: function(text){

        return( text === '' || typeof text === 'undefined' ? '' : new Buffer(text).toString('base64') );
    },

    /**
     *
     * Decodificación de texto de Base64 a ASCII
     *
     * @function base64Decode
     * @param text {string} Cadena de texto a decodificar
     * @returns {string} Devuelve una cadena de texto decodificada a ASCII
     * @see https://es.wikipedia.org/wiki/ASCII
     */

    base64Decode: function(text){

        return (text === '' || typeof text === 'undefined' ? '' : new Buffer(text, 'base64').toString('ascii'));
    }
};

module.exports = utils;