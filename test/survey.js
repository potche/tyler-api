"use strict";

var server = require('../app/app.js');
var chai = require('chai');
var request = require('request');
var async = require('async');

var clientToken;
var adminToken;
var createdSurveyId;
var createdBy = "56df5e4f5db1ea0b3b5bb8a5";
var school = "56df5e4f5db1ea0b3b5bb8a0";
var schoolPeriod = "56df5e4f5db1ea0b3b5bb8a9";
var schoolSubject = "56df5e4f5db1ea0b3b5bb8a1";
var schoolGrade = "56df5e4f5db1ea0b3b5bb8a3";
var schoolLevel = "56df5e4f5db1ea0b3b5bb8a4";
var profile = "56df5e4f5db1ea0b3b5bb8a4";
var surveyOK = {

    "title": "Demo survey",
    "description": "This is a demo for mocha testing",
    "instruction":  "Please answer",
    "createdBy": createdBy,
    "active": true,
    "sandbox": false,
    "sectionRandom": false,
    "media": false,
    "sections": [{
        "name": "Hard questions",
        "sectionOrder": 1,
        "instruction": "Solve if you can",
        "introduction": "This is the hardest test ever",
        "value": 33.33,
        "settings": [{
            "random": false
        }],
        "questions":[
            {
                "questionId" : "56df5eb95db1ea0b3b5bb8ac",
                "value": 20,
                "order": 1
            },
            {
                "questionId" : "56df5e4f5db1ea0b3b5bb8a4",
                "value": 20,
                "order": 2
            },
            {
                "questionId" : "56df5eee5db1ea0b3b5bb8b1",
                "value": 60,
                "order": 3
            }
        ]
    },
        {
            "name": "Hard questions part 2",
            "sectionOrder": 2,
            "instruction": "Solve if you've got to this point",
            "introduction": "Don't speak",
            "value": 66.66,
            "settings": [{
                "random": false
            }],
            "questions":[
                {
                    "questionId" : "56df5ef85db1ea0b3b5bb8b6",
                    "value": 100,
                    "order": 1
                }
            ]
        }
    ],
    "assignments": [
        {
            "schools": [school],
            "schoolPeriods": [schoolPeriod],
            "schoolSubjects": [schoolSubject,"56df5e4f5db1ea0b3b5bb8a2"],
            "schoolGrades": [schoolGrade,"56df5e4f5db1ea0b3b5bb8a2"],
            "roles": [
                {
                    "schoolLevel": schoolLevel,
                    "profile": profile
                },
                {
                    "schoolLevel": "56df5e4f5db1ea0b3b5bb8a5",
                    "profile": "56df5e4f5db1ea0b3b5bb8a5"
                }
            ]
        }
    ]
};

describe('Survey unit tests', function(){

    before(function(done){

        async.series([

            function(callback){

                request({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    uri: 'http://127.0.0.1:3001/v1/getCredentials',
                    method: 'POST',
                    body:JSON.stringify({

                        "applicationId": "f964b2d0-8433-4a7c-b22b-bd4cb91e38b7",
                        "applicationPassword": "MDViNTBjNjA5OTU5MTBhNGM1MGJjMDE0NDA="
                    })
                }, function (err, res, body) {

                    if(!err){

                        var obj = JSON.parse(body);
                        clientToken= obj.apiToken;
                        callback();
                    }
                });
            },
            function(callback){

                request({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    uri: 'http://127.0.0.1:3001/v1/getCredentials',
                    method: 'POST',
                    body: JSON.stringify({
                        "applicationId": "37096689-100e-44ec-953f-57291af8a9b2",
                        "applicationPassword": "MGIxYTk2NGEwY2UxN2IxZjFkOTBiMThlYzA="
                    })
                }, function (err, res, body) {

                    if(!err){

                        var obj = JSON.parse(body);
                        adminToken = obj.apiToken;
                        callback();
                    }
                });
            }
        ], function(err){
            done();
        });
    });

    it('Must return 404 when getting no surveys because this app has not created any', function(done){

        request ({
            headers: {
                'x-access-token': clientToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/surveys',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('message');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal("Resource not found");
            chai.expect(obj.error).to.equal("Surveys not found");
            done();
        });
    });

    it('Must return 200 when creating one survey correctly', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/survey',
            method: 'POST',
            body: JSON.stringify(surveyOK)
        }, function(err,response,body) {

            var obj = JSON.parse(body);
            createdSurveyId = obj.id;

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.include.keys('id');
            chai.expect(obj.status).to.equal(200);
            chai.expect(obj.message).to.equal('Successfully created');
            done();
        });
    });

    it('Must return 200 when getting surveys correctly', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/surveys',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.be.an('array');
            done();
        });
    });

    it('Must return 200 when getting one survey correctly by id', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/survey/'+createdSurveyId,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.include.keys('_id');
            chai.expect(obj).to.be.an('object');
            done();
        });
    });

    it('Must return 200 when getting surveys correctly by school', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/surveys/bySchool/'+school,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.be.an('array');
            done();
        });
    });

    it('Must return 200 when getting surveys correctly by schoolPeriod', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/surveys/byPeriod/'+schoolPeriod,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.be.an('array');
            done();
        });
    });

    it('Must return 200 when getting surveys correctly by creator', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/surveys/byCreator/'+createdBy,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.be.an('array');
            done();
        });
    });

    it('Must return 200 when getting surveys correctly by grade', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/surveys/byGrade/'+schoolGrade,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.be.an('array');
            done();
        });
    });

    it('Must return 200 when getting surveys correctly by level', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/surveys/byLevel/'+schoolLevel,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.be.an('array');
            done();
        });
    });

    it('Must return 200 when getting surveys correctly by profile', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/surveys/byProfile/'+profile,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.be.an('array');
            done();
        });
    });

    it('Must return 200 when getting surveys correctly by subject', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/surveys/bySubject/'+schoolSubject,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.be.an('array');
            done();
        });
    });

    it('Must return 200 when getting one survey correctly by role', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/surveys/byRole/'+schoolLevel+'/'+profile,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.be.an('array');
            done();
        });
    });
    it('Must return 200 when updating one survey correctly', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/survey/'+createdSurveyId,
            method: 'PUT',
            body: JSON.stringify({

                "title": "New title updated",
                "modifiedBy": "56df5eb95db1ea0b3b5bb80a"
            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.include.keys('id');
            chai.expect(obj.status).to.equal(200);
            chai.expect(obj.message).to.equal('Successfully updated');
            chai.expect(obj.id).to.equal(createdSurveyId);
            done();
        });
    });

    it('Must return 400 when trying to create survey with no sections', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/survey',
            method: 'POST',
            body: JSON.stringify({

                "title": "Demo survey",
                "description": "This is a demo for mocha testing",
                "instruction":  "Please answer",
                "createdBy": createdBy,
                "active": true,
                "sandbox": false,
                "sectionRandom": false,
                "media": false
            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.not.include.keys('id');
            chai.expect(obj.status).to.equal(400);
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            done();
        });
    });

    it('Must return 400 when trying to create survey with no createdBy parameter', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/survey',
            method: 'POST',
            body: JSON.stringify({

                "title": "Demo survey",
                "description": "This is a demo for mocha testing",
                "instruction":  "Please answer",
                "active": true,
                "sandbox": false,
                "sectionRandom": false,
                "media": false
            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.not.include.keys('id');
            chai.expect(obj.status).to.equal(400);
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            done();
        });
    });

    it('Must return 400 when getting one survey incorrectly by a malformed id', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/survey/.#.',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('message');
            chai.expect(obj.status).to.equal(400);
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj.error.name).to.equal('CastError');
            done();
        });
    });

    it('Must return 400 when trying to update survey without required parameters', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/survey/'+createdSurveyId,
            method: 'PUT',
            body: JSON.stringify({

                "title": "New title updated"
            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('message');
            chai.expect(obj.status).to.equal(400);
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj.error).to.equal('Required fields for survey update are missing');
            done();
        });
    });

    it('Must return 400 when trying to update incorrectly through one malformed id', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/survey/.#.',
            method: 'PUT',
            body: JSON.stringify({

                "title": "New title updated",
                "modifiedBy": "56df5eb95db1ea0b3b5bb80a"
            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('message');
            chai.expect(obj.status).to.equal(400);
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj.error.name).to.equal('CastError');
            done();
        });
    });

    it('Must return 400 when trying to delete incorrectly through one malformed id', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/survey/.#.',
            method: 'DELETE'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('message');
            chai.expect(obj.status).to.equal(400);
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj.error.name).to.equal('CastError');
            done();
        });
    });

    it('Must return 404 when getting one survey incorrectly by non-existing id', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/survey/54dd9eb95db1ea0b3b5bb8ac',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('message');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Survey not found with given id');
            done();
        });
    });

    it('Must return 404 when getting one survey incorrectly by non-existing creator', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/surveys/byCreator/54dd9eb95db1ea0b3b5bb8ac',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('message');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Surveys not found for this creator');
            done();
        });
    });

    it('Must return 404 when getting one survey incorrectly by non-existing period', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/surveys/byPeriod/54dd9eb95db1ea0b3b5bb8ac',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('message');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Surveys not found with given parameters');
            done();
        });
    });

    it('Must return 404 when getting one survey incorrectly by non-existing subject', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/surveys/bySubject/54dd9eb95db1ea0b3b5bb8ac',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('message');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Surveys not found with given parameters');
            done();
        });
    });

    it('Must return 404 when getting one survey incorrectly by non-existing school', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/surveys/bySchool/54dd9eb95db1ea0b3b5bb8ac',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('message');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Surveys not found with given parameters');
            done();
        });
    });

    it('Must return 404 when getting one survey incorrectly by non-existing grade', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/surveys/byGrade/54dd9eb95db1ea0b3b5bb8ac',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('message');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Surveys not found with given parameters');
            done();
        });
    });

    it('Must return 404 when getting one survey incorrectly by non-existing level', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/surveys/byLevel/54dd9eb95db1ea0b3b5bb8ac',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('message');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Surveys not found with given parameters');
            done();
        });
    });

    it('Must return 404 when getting one survey incorrectly by non-existing profile', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/surveys/byProfile/54dd9eb95db1ea0b3b5bb8ac',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('message');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Surveys not found with given parameters');
            done();
        });
    });

    it('Must return 404 when getting one survey incorrectly by non-existing role', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/surveys/byRole/54dd9eb95db1ea0b3b5bb8ac/54dd9eb95db1ea0b3b5bb8ac',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('message');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Surveys not found with given roles');
            done();
        });
    });

    it('Must return 404 when trying to update one survey by non-existing id', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/survey/54df5eb95db1ea0b3b5bb83a',
            method: 'PUT',
            body: JSON.stringify({

                "title": "New title updated",
                "modifiedBy": "56df5eb95db1ea0b3b5bb80a"
            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('message');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Survey not found with given id');
            done();
        });
    });

    it('Must return 404 when trying to delete one survey by non-existing id', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/survey/54df5eb95db1ea0b3b5bb83a',
            method: 'DELETE'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('message');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Survey not found with given id');
            done();
        });
    });

    it('Must return 200 when deleting one survey correctly', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/survey/'+createdSurveyId,
            method: 'DELETE'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('message');
            chai.expect(obj).to.include.keys('id');
            chai.expect(obj.status).to.equal(200);
            chai.expect(obj.message).to.equal('Successfully deleted');
            chai.expect(obj.id).to.equal(createdSurveyId);
            done();
        });
    });
});