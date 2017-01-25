'use strict';

var server = require('../app/app.js');
var chai = require('chai');
var request = require('request');
var async = require('async');
var appToken;
var appId = "37096689-100e-44ec-953f-57291af8a9b2";
var createdAnswerId;
var surveyId = '5720e540276ae71c2095f86d';
var qtInUse = '56cb5619bfbfa90225bc2daf';
var respondantObject = {

    "respondantId" : "56ac5eb95db1ea0b3b5bb8aa",
    "schoolId": "56ac5eb95db1ea0b3b5bb8ab",
    "schoolPeriod": "56ac5eb95db1ea0b3b5bb8ac",
    "scholarity": {

        "schoolRole": "56ac5eb95db1ea0b3b5bb8ad",
        "schoolLevel": "56ac5eb95db1ea0b3b5bb8ae",
        "schoolSubject": "56ac5eb95db1ea0b3b5bb8af",
        "schoolGrade": "56ac5eb95db1ea0b3b5bb8b0",
        "schoolGroup": "56ac5eb95db1ea0b3b5bb8b1"
    }
};

describe('Stats controller tests', function () {

    before(function(done){

        async.series([

            function(callback){

                request({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    uri: 'http://127.0.0.1:3001/v1/getCredentials',
                    method: 'POST',
                    body: JSON.stringify({
                        "applicationId": appId,
                        "applicationPassword": "MGIxYTk2NGEwY2UxN2IxZjFkOTBiMThlYzA="
                    })
                }, function (err, res, body) {

                    if(!err){

                        var obj = JSON.parse(body);
                        appToken = obj.apiToken;
                        callback();
                    }
                });
            }
        ], function(err){
            done();
        });
    });

    it('Must return 200 ok with statistics from 1 created survey (default)',function(done){

        request ({
            headers: {
                'x-access-token': appToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/stats/volume/surveys',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.be.an('array');
            chai.expect(obj.length).to.not.equal(0);
            done();
        });

    });

    it('Must return 200 ok with statistics from 1 created survey (default) when searching by application which created that survey',function(done){

        request ({
            headers: {
                'x-access-token': appToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/stats/volume/surveys/byApp/'+appId,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.be.an('array');
            chai.expect(obj.length).to.not.equal(0);
            done();
        });
    });

    it('Must return 200 ok with statistics from 1 created answer (default) when searching by application which created that answer',function(done){

        async.series([

            function(callback){

                request({
                    headers: {
                        'x-access-token': appToken,
                        'Content-Type': 'application/json'
                    },
                    uri: 'http://127.0.0.1:3001/v1/answer',
                    method: 'POST',
                    body: JSON.stringify({

                        "timeSpent" : 18000,
                        "surveyId" : surveyId,
                        "respondant" : respondantObject,
                        "sections" : [
                            {
                                "value" : 33.33,
                                "answers" : [
                                    {
                                        "value" : 20,
                                        "correctOptions" : 1,
                                        "correctOptionType" : "truefalse",
                                        "questionId" : "56df5eb95db1ea0b3b5bb8ac",
                                        "options" : [
                                            {
                                                "value" : "1",
                                                "option" : "Humano"
                                            }
                                        ]
                                    },
                                    {
                                        "value" : 20,
                                        "correctOptions" : 1,
                                        "correctOptionType" : "quantitative",
                                        "questionId" : "56df5e4f5db1ea0b3b5bb8a4",
                                        "options" : [
                                            {
                                                "value" : "4",
                                                "option" : "Muy sencillo"
                                            }
                                        ],
                                        "maxVal" : 4
                                    },
                                    {
                                        "value" : 60,
                                        "correctOptions" : 2,
                                        "correctOptionType" : "matching",
                                        "questionId" : "56df5eee5db1ea0b3b5bb8b1",
                                        "options" : [
                                            {
                                                "answerGiven" : "Independencia",
                                                "value" : "independencia",
                                                "option" : "_1"
                                            },
                                            {
                                                "answerGiven" : "Mexicana",
                                                "value" : "mexicana",
                                                "option" : "_2"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "value" : 66.66,
                                "answers" : [
                                    {
                                        "value" : 100,
                                        "correctOptions" : 4,
                                        "correctOptionType" : "matching",
                                        "questionId" : "56df5ef85db1ea0b3b5bb8b6",
                                        "options" : [
                                            {
                                                "value" : "1",
                                                "option" : "Cruzadas",
                                                "answerGiven": "1"
                                            },
                                            {
                                                "value" : "2",
                                                "option" : "Independencia de México",
                                                "answerGiven": "3"
                                            },
                                            {
                                                "value" : "3",
                                                "option" : "Crisis de 1929",
                                                "answerGiven": "2"
                                            },
                                            {
                                                "value" : "4",
                                                "option" : "Guerra fría",
                                                "answerGiven": "4"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    })
                }, function (err, res, body) {

                    var obj = JSON.parse(body);
                    createdAnswerId = obj.id;
                    callback();
                });
            },
            function(callback){

                request ({
                    headers: {
                        'x-access-token': appToken,
                        'content-type': 'application/json'
                    },
                    uri: 'http://127.0.0.1:3001/v1/stats/volume/answers/byApp/'+appId,
                    method: 'GET'
                }, function(err,response,body) {

                    var obj = JSON.parse(body);

                    chai.expect(response.statusCode).to.equal(200);
                    chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
                    chai.expect(obj).to.not.include.keys('error');
                    chai.expect(obj).to.be.an('array');
                    chai.expect(obj.length).to.not.equal(0);
                    callback();
                });
            }
        ], function(err){
            done();
        });
    });

    it('Must return 200 ok with statistics from 1 created answer',function(done){

        request ({
            headers: {
                'x-access-token': appToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/stats/volume/answers',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.be.an('array');
            chai.expect(obj.length).to.not.equal(0);
            done();
        });
    });

    it('Must return 200 ok with statistics from 1 created survey (default) when searching by existing date',function(done){

        request ({
            headers: {
                'x-access-token': appToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/stats/volume/surveys/byTime/2015-01-01/2021-12-31',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.be.an('array');
            chai.expect(obj.length).to.not.equal(0);
            done();
        });
    });

    it('Must return 200 ok with statistics from 1 created answer when searching by existing date',function(done){

        request ({
            headers: {
                'x-access-token': appToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/stats/volume/answers/byTime/2015-01-01/2021-12-31',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.be.an('array');
            chai.expect(obj.length).to.not.equal(0);
            done();
        });
    });

    it('Must return 200 ok when getting questions classified by their question type', function(done){

        request ({
            headers: {
                'x-access-token': appToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/stats/volume/questions',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.be.an('array');
            chai.expect(obj.length).to.not.equal(0);
            done();
        });

    });

    it('Must return 200 ok when getting question stats by a question type which is being used in at least one question', function(done){

        request ({
            headers: {
                'x-access-token': appToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/stats/volume/questions/byType/'+qtInUse,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.be.an('array');
            chai.expect(obj.length).to.not.equal(0);
            done();
        });
    });

    it('Must return 400 when question type id is wrong or malformed', function(done){

        request ({
            headers: {
                'x-access-token': appToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/stats/volume/questions/byType/dasdasjkdjksjkdsa',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(400);
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj.error).to.equal('Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters');
            done();
        });
    });

    it('Must return 404 when some questionType is not being used in at least one question', function(done){

        request ({
            headers: {
                'x-access-token': appToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/stats/volume/questions/byType/56aa43bb8bc9f4856f558c10',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Could not find any statistics');
            done();
        });
    });

    it('Must return 404 stats not found when searching surveys by non-existing application or app has not created any survey',function(done){

        request ({
            headers: {
                'x-access-token': appToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/stats/volume/surveys/byApp/56aa43bb8bc9f4856f558c10',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Could not find any statistics');
            done();
        });
    });

    it('Must return 404 stats not found when searching surveys by non-existing date',function(done){

        request ({
            headers: {
                'x-access-token': appToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/stats/volume/surveys/byTime/2012-01-01/2012-01-02',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Could not find any statistics');
            done();
        });
    });

    it('Must return 404 stats not found when searching answers by non-existing application or app has not created any survey',function(done){

        request ({
            headers: {
                'x-access-token': appToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/stats/volume/answers/byApp/56aa43bb8bc9f4856f558c10',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Could not find any statistics');
            done();
        });
    });

    it('Must return 404 stats not found when searching answers by non-existing date',function(done){

        request ({
            headers: {
                'x-access-token': appToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/stats/volume/answers/byTime/2012-01-01/2012-01-02',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Could not find any statistics');
            done();
        });
    });

    it('Must return 404 Resource not found when path is incomplete',function(done){

        request ({
            headers: {
                'x-access-token': appToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/stats/volume/surveys/byTime/2015-01-01',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Endpoint not found');
            done();
        });
    });

    it('Must return 404 stats not found when params are incorrect',function(done){

        request ({
            headers: {
                'x-access-token': appToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/stats/volume/answers/byTime/jasdjkdasjkds/jdsajkdjkadjkas',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Could not find any statistics');
            done();
        });
    });

    after(function(done){

        async.series([

            function(callback){

                request({
                    headers: {
                        'x-access-token': appToken,
                        'Content-Type': 'application/json'
                    },
                    uri: 'http://127.0.0.1:3001/v1/answer/'+createdAnswerId,
                    method: 'DELETE'
                }, function (err, res, body) {

                    callback();
                });
            }
        ], function(err){
            done();
        });

    });
});