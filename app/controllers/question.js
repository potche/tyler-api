/**
 *  Controller Question
 *
 *  @author Israel Reyes <israelr@dsindigo.com>
 *  @version 1.0.0
 *  @module app/controllers/question
 *
 */

var Question = require('../models/question');
var utils = require('../../config/utils');
var security = require('../../config/security');

var questionController = {
    /**
     * Function that returns one document based on the ID provided in the URL
     *
     * @function getOne
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * GET/ HTTP 1.1
     * v1/question/byId
     */
    getById: function (req, res) {
        var id = req.params.questionId;
        var applicationId = security.getApplicationId(req.headers['x-access-token']);

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(404);
            res.json(utils.getResponseFormat(404,'Invalid ID',null));
            return;
        }

        // Using query builder
        Question.
            findOne({ }).
            where('_id', id).
            exec(function (err, data) {
                if (err) {
                    questionController.errorHandler(err, res);
                } else {

                    if (!data || data.length === 0) {
                        res.status(404);
                        res.json(utils.getResponseFormat(404, 'Empty records', null));
                    } else {
                        if (!data.active) {
                            res.status(404);
                            res.json(utils.getResponseFormat(404, 'This question is inactivated', null));
                        }else if(String(data.applicationId) !== applicationId){
                            res.status(401);
                            res.json(utils.getResponseFormat(401, 'id not found for your applicationId', null));
                        } else {
                            res.status(200);
                            res.json(data);
                        }

                    }
                }
            });
    },
    /**
     * Function that returns one document based on the SchoolId provided in the URL
     *
     * @function getBySchool
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * GET/ HTTP 1.1
     * v1/questions/bySchool
     */
    getBySchool: function (req, res) {
        var id = req.params.schoolId;
        var applicationId = security.getApplicationId(req.headers['x-access-token']);

        questionController.getResponse(req, res, id, { $and: [
            { $or: [ { "assignments.schools": {$in: [id]} }, { "assignments.schools": [] } ]},
            { "active": { $eq: true }},
            { "applicationId": applicationId}
        ] });

    },
    /**
     * Function that returns one document based on the Rol provided in the URL
     *
     * @function getByRol
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * GET/ HTTP 1.1
     * v1/questions/byRol
     */
    getByRol: function (req, res) {
        var profileId = req.params.profileId;
        var levelId = req.params.levelId;
        var applicationId = security.getApplicationId(req.headers['x-access-token']);

        if (!profileId.match(/^\d+$/)) {
            res.status(404);
            res.json(utils.getResponseFormat(404,'Invalid ID',profileId));
            return false;
        }

        if (!levelId.match(/^\d+$/)) {
            res.status(404);
            res.json(utils.getResponseFormat(404,'Invalid ID',levelId));
            return false;
        }

        questionController.findR(res, { $and: [
            { $or: [ { "assignments.roles.profile": {$in: [profileId]} }, { "assignments.roles.profile": [] } ]},
            { $or: [ { "assignments.roles.schoolLevel": {$in: [levelId]} }, { "assignments.roles.schoolLevel": {$exists: false} } ]},
            { "active": { $eq: true }},
            { "applicationId": applicationId}
        ] });

    },
    /**
     * Function that returns one document based on the GradeId provided in the URL
     *
     * @function getByGrade
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * GET/ HTTP 1.1
     * v1/questions/byGrade
     */
    getByGrade: function (req, res) {
        var id = req.params.GradeId;
        var applicationId = security.getApplicationId(req.headers['x-access-token']);

        questionController.getResponse(req, res, id, { $and: [
            { $or: [ { "assignments.roles.schoolGrades": {$in: [id]} }, { "assignments.roles.schoolGrades": [] } ]},
            { "active": { $eq: true }},
            { "applicationId": applicationId}
        ] });

    },
    /**
     * Function that returns one document based on the SchoolPeriod provided in the URL
     *
     * @function getBySchoolPeriod
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * GET/ HTTP 1.1
     * v1/questions/bySchoolPeriod
     */
    getBySchoolPeriod: function (req, res) {
        var id = req.params.schoolPeriodId;
        var applicationId = security.getApplicationId(req.headers['x-access-token']);

        questionController.getResponse(req, res, id, { $and: [
            { $or: [ { "assignments.schoolPeriods": {$in: [id]} }, { "assignments.schoolPeriods": [] } ]},
            { "active": { $eq: true }},
            { "applicationId": applicationId}
        ] });
    },
    /**
     * Function that returns one document based on the Subject provided in the URL
     *
     * @function getBySubject
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * GET/ HTTP 1.1
     * v1/questions/bySubject
     */
    getBySubject: function (req, res) {
        var id = req.params.SubjectId;
        var applicationId = security.getApplicationId(req.headers['x-access-token']);

        questionController.getResponse(req, res, id, { $and: [
            { $or: [ { "assignments.schoolSubjects": {$in: [id]} }, { "assignments.schoolSubjects": [] } ]},
            { "active": { $eq: true }},
            { "applicationId": applicationId}
        ] });

    },
    /**
     * Function that returns one document based on the Grade and Subject provided in the URL
     *
     * @function getByGradeSubject
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * GET/ HTTP 1.1
     * v1/questions/byGradeSubject/3/15
     */
    getByGradeSubject: function (req, res) {
        var gradeId = req.params.GradeId;
        var subjectId = req.params.SubjectId;
        var applicationId = security.getApplicationId(req.headers['x-access-token']);

        if (!gradeId.match(/^\d+$/)) {
            res.status(404);
            res.json(utils.getResponseFormat(404,'Invalid ID',gradeId));
            return false;
        }

        if (!subjectId.match(/^\d+$/)) {
            res.status(404);
            res.json(utils.getResponseFormat(404,'Invalid ID',subjectId));
            return false;
        }
        questionController.findR(res, { $and: [
            { $or: [ { "assignments.roles.schoolGrades": {$in: [gradeId]} }, { "assignments.roles.schoolGrades": [] } ]},
            { $or: [ { "assignments.schoolSubjects": {$in: [subjectId]} }, { "assignments.schoolSubjects": [] } ]},
            { "active": { $eq: true }},
            { "applicationId": applicationId}
        ] });

    },
    /**
     * Function that creates a Question
     *
     * @function create
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * POST/ HTTP 1.1
     * v1/question
     * Raw: {
        "question": "¿Qué especie eres?",
        "createdBy": 4389483,
        "categories": ["92393292"],
        "questionTypeId": 323232,
        "options": [1,2,3,4],
        "correctOptions": 1,
        "assignments":[
            {
                "schools": [1209,1253],
                "schoolPeriods": [19],
                "schoolSubjects": [4],
                "roles":[
                    {
                        "schoolLevel": 16,
                        "profile": [18],
                        "schoolGrades": [3]
                    }
                ]
            }
        ]
     * }
     */
    create: function (req, res) {
        var applicationId = security.getApplicationId(req.headers['x-access-token']);

        if(!req.body.options || (req.body.options.length === 0) ) {
            res.status(400);
            res.json(utils.getResponseFormat(400, 'Empty options', null));

            return;
        }

        req.body.applicationId = applicationId;
        req.body.createDate = new Date();

        var question = new Question(req.body);

        question.validate(function (err) {
            //err.errors would contain a validation error for manufacturer with default message
            if (err) {
                res.status(400);
                res.json(utils.getResponseFormat(400, err.errors, null));
            } else {
                question.save(function (err) {
                    questionController.createUpdateResponse(res, question, err, 'create', function(result){
                        if (result.status){
                            res.status(result.status);
                            res.json(result);
                        }
                    });
                });
            }
        });
    },
    /**
     * Function that updates a question published
     *
     * @function updatePublish
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * PUT/ HTTP 1.1
     * v1/question/publish/aaCCf86dbf8709084aa2f230
     * Raw: {
        'publishedBy': 1010722
     * }
     */
    updatePublish: function (req, res) {
        var id = req.params.questionId;
        var applicationId = security.getApplicationId(req.headers['x-access-token']);

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(404);
            res.json(utils.getResponseFormat(404,'Invalid ID',null));
        }else if(!req.body.publishedBy){
            res.status(400);
            res.json(utils.getResponseFormat(400,'Empty publishedBy',null));
        }else {
            var dat = {
                'id': id,
                'sandbox': false,
                'publishedBy': req.body.publishedBy,
                'publishDate': new Date(),
                'modifyDate': new Date()
            };
            questionController.findUpdatePublish(dat, res, applicationId);
        }
    },
    /**
     * Function that inactivate a question
     *
     * @function enable
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * PUT/ HTTP 1.1
     * v1/question/enable/aaCCf86dbf8709084aa2f230
     *
     */
    enable: function (req, res) {
        var id = req.params.questionId;

        var val = questionController.valUpdateEnable(req);
        var applicationId = security.getApplicationId(req.headers['x-access-token']);

        if (typeof (val[0]) !== 'boolean') {
            res.status(val[0]);
            res.json(utils.getResponseFormat(val[0],val[1],null));
            return;
        }

        var dat = {
            'id': id,
            'active': req.body.active,
            'updatedBy': req.body.updatedBy,
            'modifyDate': new Date()
        };

        questionController.internalUpdateEnable(dat, applicationId, res);

    },
    /**
     * Function that updated a question
     *
     * @function update
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * PUT/ HTTP 1.1
     * v1/question/aaCCf86dbf8709084aa2f230
     * Raw: {
        "categories": ["92393292"],
        "questionTypeId": 323232,
        "options": [1,2,3,4],
        "assignments":[
            "schools": [1209,1253],
            "schoolPeriods": [19],
            "schoolSubjects": [4],
            "roles":[
                {
                    "schoolLevel": 16
                    "profile": [18],
                    "schoolGrades": [3]
                }
            ]
        ]
     * }
     */
    update: function (req, res) {
        var id = req.params.questionId;

        var applicationId = security.getApplicationId(req.headers['x-access-token']);

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(404);
            res.json(utils.getResponseFormat(404,'Invalid ID',null));
            return;
        }

        if(!req.body.updatedBy){
            res.status(400);
            res.json(utils.getResponseFormat(400, 'Empty updatedBy', null));
            return;
        }

        var dat = {
            'id': id,
            'updatedBy': req.body.updatedBy,
            'modifyDate': new Date(),
            'categories': req.body.categories,
            'questionTypeId': req.body.questionTypeId,
            'options': req.body.options,
            'correctOptions': req.body.correctOptions,
            'maxVal': req.body.maxVal,
            'assignments': req.body.assignments
        };

        questionController.internalUpdate(dat, applicationId, function (status, err, message, id) {
            res.status(status);
            res.json(utils.getResponseFormat(err,message,id));
        });

    },
    /**
     * Function that deletes a Question based on the ID provided in the URL
     *
     * @function delete
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * DELETE/ HTTP 1.1
     * v1/question/56cde0949dafb8a40131d724
     */
    delete: function (req, res) {
        var id = req.params.questionId;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(404);
            res.json(utils.getResponseFormat(404,'Invalid ID',null));
            return;
        }
        Question.findOne({'_id': id}, function (err, data) {
            if (!err && data !== null) {
                data.remove(function (err) {
                    //escenarios de respuesta.
                    if (err) {
                        questionController.errorHandler(err, res);
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
                res.status(401);
                res.json(utils.getResponseFormat(401, 'Invalid ID', null));
            }
        });

    },
    /**
     * Function that deletes all Questions
     *
     * @function deleteAll
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * DELETE/ HTTP 1.1
     * v1/questions
     */
    deleteAll: function (req, res) {

        Question.remove({}, function (err) {
            if (err) {
                questionController.errorHandler(err, res);
            } else {
                res.status(200);
                res.json({
                    'status': 200,
                    'message': 'Collection eliminated'
                });
            }
        });

    },
    /**
     * validate
     *
     * @private
     * @function validateId
     * @param dat {string}
     */
    valUpdateEnable: function(dat){

        var status = false;
        var message = '';

        if (!dat.params.questionId.match(/^[0-9a-fA-F]{24}$/)) {
            status = 404;
            message = 'Invalid ID';
        }else if(!dat.body.updatedBy) {
            status = 400;
            message = 'Empty updatedBy';
        }else if( typeof (dat.body.active) !== "boolean" ) {
            status = 400;
            message = 'Empty active';
        }

        return [status, message];

    },
    /**
     * Internal function updates enable based on the ID provided
     * This function is not accesible via API
     * @private
     *
     * @function internalUpdate
     * @param question {object} The address data
     * @param callback {callback} Returns the status of the Update operation
     */
    internalUpdateEnable: function (question, applicationId, res) {
        var msj;

        if(question.active === true){
            msj = "actived";
        }else{
            msj = "inactived";
        }

        Question.findOne({'_id': question.id, 'applicationId': applicationId}, function (err, data) {
            if (!err && data !== null) {
                if(question.active === data.active){
                    res.status(409);
                    res.json(utils.getResponseFormat(409, 'This question has already been '+msj, null));
                }else{
                    data.active = question.active;
                    data.updatedBy = question.updatedBy;
                    data.modifyDate = question.modifyDate;

                    data.save(function (err, data) {
                        questionController.createUpdateResponse(res, data, err, 'update', function(result){
                            if (result.status){
                                res.status(200);
                                res.json(result);
                            }
                        });

                    });
                }
            } else {
                res.status(401);
                res.json(utils.getResponseFormat(401, 'Authorization failed', null));
            }
        });


    },
    /**
     * Internal function updates question based on the ID provided
     * This function is not accesible via API
     * @private
     *
     * @function internalUpdate
     * @param dat {object} The address data
     * @param callback {callback} Returns the status of the Update operation
     */
    internalUpdate: function (dat, applicationId, callback) {

        Question.findOne({'_id': dat.id, 'applicationId': applicationId}, function (err, data) {
            if (!err && data !== null) {

                if(!data.active){
                    callback(409, 409, 'This question has already been inactived', null);
                }else if(!data.sandbox){
                    callback(409, 409, 'This question has already been published', null);
                }else{
                    data.updatedBy = dat.updatedBy;
                    data.modifyDate = dat.modifyDate;

                    data = questionController.asigInternalUpdate(dat, data);

                    data.save(function (err, data) {
                        if (err) {
                            callback(500, 500, err, null);
                        }else {
                            callback(200, 204, err, data._id);
                        }
                    });
                }
            } else {
                callback(401, 401, 'Authorization failed', null);
            }
        });
    },
    /**
     * This function is not accesible via API
     * @private
     *
     * @function asigInternalUpdate
     * @param dat {object}
     * @param data {object}
     */
    asigInternalUpdate: function (dat, data) {

        if(dat.categories)
            data.categories = dat.categories;
        if(dat.questionTypeId)
            data.questionTypeId = dat.questionTypeId;
        if(dat.options)
            data.options = dat.options;
        if(dat.correctOptions)
            data.correctOptions = dat.correctOptions;
        if(dat.maxVal)
            data.maxVal = dat.maxVal;
        if(dat.assignments)
            data.assignments = dat.assignments;

        return data;
    },
    getResponse: function(req, res, id, query){

        if (!id.match(/^\d+$/)) {
            res.status(404);
            res.json(utils.getResponseFormat(404,'Invalid ID',id));
            return false;
        }

        Question.find(query , function (err, data) {
            questionController.findResponse(res, data, err, function(result){

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
    findR: function (res, query){
        Question.find(query , function (err, data) {
            questionController.findResponse(res, data, err, function(result){

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
            if (typeof(data) === 'object' && data.length === 0){
                callback(utils.getResponseFormat(404,'Empty records',null));
            } else{
                callback(data);
            }
        }
    },
    createUpdateResponse: function (res, data, err, method, callback) {
        if (err) {
            callback(utils.getResponseFormat(500, err, null));
        } else {
            if(method === 'create')
                callback(utils.getResponseFormat(200, null, data._id));
            else
                callback(utils.getResponseFormat(204, null, data._id));
        }
    },
    findUpdatePublish: function(dat, res, applicationId){

        Question.findOne({'_id': dat.id, 'applicationId': applicationId}, function (err, data) {

            if (!err && data !== null) {

                if(!data.active){
                    res.status(409);
                    res.json(utils.getResponseFormat(409,'This question is inactivated',null));
                }else if(data.publishedBy){
                    res.status(409);
                    res.json(utils.getResponseFormat(409,'his question has already been published',null));
                }else {

                    data.sandbox = dat.sandbox;
                    data.publishedBy = dat.publishedBy;
                    data.publishDate = dat.publishDate;

                    data.save(function (err) {
                        questionController.createUpdateResponse(res, data, err, 'update', function (result) {
                            if (result.status) {
                                res.status(200);
                                res.json(result);
                            }
                        });
                    });
                }
            } else {
                res.status(401);
                res.json(utils.getResponseFormat(401, 'Authorization failed', null));
            }
        });
    },
    errorHandler: function (err, res) {
        console.error('lastErrors ', err.toString());
        res.status(500);
        res.json(utils.getResponseFormat(500, err, null));
    }

};

module.exports = questionController;