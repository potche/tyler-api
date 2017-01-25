/**
 *  Controller Category
 *
 *  @author Isra Rey
 *  @version 1.0.0
 */

var Category = require('../models/category');
var utils = require('../../config/utils');

var CategoryController = {

    /**
     * Function returns all documents in Category model
     *
     * @function getAll
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * GET/ HTTP 1.1
     * v1/categories
     */
    getAll: function (req, res) {

        Category.find({}, function (err, data) {
            CategoryController.findResponse(res, data, err, function(result){

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
     * unction that returns one document based on the ID provided in the URL
     *
     * @function getById
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * GET/ HTTP 1.1
     * v1/category/565c9debf399bed013d49b98
     */
    getById: function (req, res) {
        var id = req.params.categoryId;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(404);
            res.json(utils.getResponseFormat(404,'Invalid ID',null));
            return;
        }

        Category.findOne({'_id': id}, function (err, data) {
            CategoryController.findResponse(res, data, err, function(result){

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
     * Function that creates a Category
     *
     * @function createCategory
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * POST/ HTTP 1.1
     * v1/category
     * Raw: {
        "category": "Biología"
     * }
     */
    createCategory: function (req, res) {

        var category = new Category(req.body);

        category.validate(function (err) {
            //err.errors would contain a validation error for manufacturer with default message
            if (err) {
                res.status(400);
                res.json(utils.getResponseFormat(400, err.errors, null));
            } else {
                category.save(function (err) {
                    CategoryController.createResponse(res, category, err, function(result){
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
     * Function that Delete a Category
     *
     * @function delete
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * DELETE/ HTTP 1.1
     * v1/category/56cb343a85bd0be118906095
     *
     */
    delete: function (req, res) {
        var id = req.params.categoryId;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(404);
            res.json(utils.getResponseFormat(404,'Invalid ID',null));
            return;
        }

        Category.findOne({'_id': id}, function (err, data) {
            if (!err && data !== null) {
                data.remove(function (err) {
                    CategoryController.internalDelete(res, err);
                });
            } else {
                res.status(401);
                res.json(utils.getResponseFormat(401, 'Invalid ID', null));
            }
        });
    },
    /**
     * Function that Delete All Categories
     *
     * @function deleteAll
     * @param req {object} Request Object
     * @param res {object} Response Object
     * @example
     * DELETE/ HTTP 1.1
     * v1/categories
     *
     */
    deleteAll: function (req, res) {

        Category.remove({}, function (err) {
            CategoryController.internalDelete(res, err);
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
    },
    createResponse: function (res, data, err, callback) {
        if (err) {
            callback(utils.getResponseFormat(500, err, null));
        } else {
            callback(utils.getResponseFormat(200, null, data._id));
        }
    },
    internalDelete: function (res, err) {
        if (err) {
            res.status(500);
            res.json(utils.getResponseFormat(500, err, null));
        } else {
            res.status(200);
            res.json({
                'status': 200,
                'message': 'Eliminated'
            });
        }
    }

};

module.exports = CategoryController;