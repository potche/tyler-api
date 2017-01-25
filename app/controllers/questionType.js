/**
 *  Controller QuestionType
 *
 *  @author Isra Rey
 *  @version 1.0.0
 */

var QuestionType = require('../models/questionType');
var utils = require('../../config/utils');

var questionTypeController = {

    /**
     * Function returns the document by Id in QuestionType model
     *
     * @function getById
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * GET/ HTTP 1.1
     * v1/questionType/56cb343a85bd0be118906010
     */
    getById: function (req, res) {

        var id = req.params.questionTypeId;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(404);
            res.json(utils.getResponseFormat(404,'Invalid ID',null));
            return;
        }

        QuestionType.findOne({'_id': id}, function (err, data) {
            questionTypeController.findResponse(res, data, err, function(result){

                if (result.status){
                    res.status(result.status);
                    res.json(result);
                }else{
                    res.status(200);
                    res.json(result);
                }

            });
        });
    },
    /**
     * Function returns all documents in QuestionType model
     *
     * @function getAll
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * GET/ HTTP 1.1
     * v1/questionTypes
     */
    getAll: function (req, res) {

        QuestionType.find({}, function (err, data) {
            questionTypeController.findResponse(res, data, err, function(result){

                if (result.status){
                    res.status(result.status);
                    res.json(result);
                }else{
                    res.status(200);
                    res.json(result);
                }

            });
        });
    },
    /**
     * Function that creates a Question Type
     *
     * @function create
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * POST/ HTTP 1.1
     * v1/questionType
     * Raw: {
        "questionType": "Opción multiple",
        "description": "Preguntas de opción múltiple donde existe sólamente una opción correcta",
        "descriptiveImgPath": "9129219921_32U2U3U2.png",
        "correctOptionType": "truefalse"
     * }
     */
    create: function (req, res) {

        var data = {
            'questionType': req.body.questionType,
            'description': req.body.description,
            'descriptiveImgPath': req.body.descriptiveImgPath,
            'correctOptionType': req.body.correctOptionType
        };

        var questionType = new QuestionType({
            questionType: data.questionType,
            description: data.description,
            descriptiveImgPath: data.descriptiveImgPath,
            active: true,
            createDate: new Date(),
            correctOptionType: data.correctOptionType
        });
        questionType.validate(function (err) {
            //err.errors would contain a validation error for manufacturer with default message
            if (err) {
                res.status(400);
                res.json(utils.getResponseFormat(400, err.errors, null));
            } else {
                questionType.save(function (err) {
                    if (err) {
                        res.status(500);
                        res.json(utils.getResponseFormat(500, err, null));
                    } else {
                        res.status(200);
                        res.json(utils.getResponseFormat(200, null, questionType._id));
                    }

                });
            }
        });
    },
    /**
     * Function that creates a array of Question Type
     *
     * @function createBatch
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * POST/ HTTP 1.1
     * v1/questionTypes/batch
     * Raw: [
         {
             "_id" : mongo.ObjectId("56cb343a85bd0be118906095"),
             "questionType" : "Opción múltiple, una respuesta",
             "description" : "Preguntas de opción múltiple donde existe sólamente una opción correcta",
             "descriptiveImgPath" : "",
             "active" : true,
             "correctOptionType" : "truefalse"
         },
         {
             "_id" : mongo.ObjectId("56cb34e885bd0be118906096"),
             "questionType" : "Opción multiple con más de una opción correcta",
             "description" : "Preguntas de opción múltiple donde es posible seleccionar más una opción correcta",
             "descriptiveImgPath" : "9129219921_32U2U3U2.png",
             "active" : true,
             "correctOptionType" : "truefalse"
         }
     ]
     */
    createBatch: function (req, res) {
        var size = req.body.length;
        if(size !== 0) {
            var count = 0;
            var i = 0;
            var ids = [];

            req.body.forEach(function(item) {

                questionTypeController.internalInsert(item, function(num, err, id){
                    i++;

                    if(num === 200){
                        count++;
                        ids.push(id);
                    }

                    if(size === i) {
                        res.status(200);
                        res.json({
                            'status': 200,
                            'insert': {
                                'total': count,
                                'ids': ids
                            },
                            'error': size - count
                        });
                    }
                });

            });

        }else {
            res.status(400);
            res.json(utils.getResponseFormat(400, err, null));
        }
    },
    /**
     * Function that Delete a Question
     *
     * @function delete
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * DELETE/ HTTP 1.1
     * v1/questionType/56cb343a85bd0be118906095
     *
     */
    delete: function (req, res) {
        var id = req.params.questionTypeId;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(404);
            res.json(utils.getResponseFormat(404,'Invalid ID',null));
            return;
        }

        QuestionType.findOne({'_id': id}, function (err, data) {
            if (!err && data !== null) {
                data.remove(function (err) {
                    //escenarios de respuesta.
                    if (err) {
                        res.status(500);
                        res.json(utils.getResponseFormat(500, err, null));
                    } else {
                        res.status(200);
                        res.json({
                            'status': 200,
                            'message': 'ID eliminated',
                            'id': id
                        });
                    }
                });
            } else {
                res.status(404);
                res.json(utils.getResponseFormat(404, 'Invalid ID', null));
            }
        });
    },
    /**
     * Function that Delete All Questions
     *
     * @function deleteAll
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * DELETE/ HTTP 1.1
     * v1/questionType
     *
     */
    deleteAll: function (req, res) {

        QuestionType.remove({}, function (err) {
            if (err) {
                res.status(500);
                res.json(utils.getResponseFormat(500, err, null));
            } else {
                res.status(200);
                res.json({
                    'status': 200,
                    'message': 'Collection eliminated'
                });
            }
        });
    },
    internalInsert: function (body, callback) {
        var questionType = new QuestionType({
            _id: body._id,
            questionType: body.questionType,
            description: body.description,
            descriptiveImgPath: body.descriptiveImgPath,
            active: body.active,
            createDate: new Date(),
            correctOptionType: body.correctOptionType
        });

        questionType.validate(function (err) {
            //err.errors would contain a validation error for manufacturer with default message
            if (err) {
                callback( 400, err.errors, null);
            } else {
                questionType.save(function (err) {
                    //escenarios de respuesta.
                    if (err) {
                        callback( 500, err, null);
                    } else {
                        callback(200, null, questionType._id);
                    }
                });
            }
        });
    },
    /**
     * Depending on the combination of data, it returns a response to the request.
     * @function findResponse
     * @param res {object} Response object
     * @param data {object} Object that contains information of a query result
     * @param err {object} Error object
     * @param type {string} Text string that determines the message to respond
     */
    findResponse: function (res, data, err, callback) {
        if(err) {
            callback(utils.getResponseFormat(500,err,null));
        } else {
            if (!data || data.length === 0){
                callback(utils.getResponseFormat(404,'Empty records',null));
            } else{
                callback(data);
            }
        }
    }

};

module.exports = questionTypeController;