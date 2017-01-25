'use strict';

var server = require('../app/app.js');
var chai = require('chai');
var request = require('request');
var async = require('async');

var clientToken;
var adminToken;
var createdAnswerId;
var surveyId = '5720e540276ae71c2095f86d';
var attempts = 0;
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
var AnswerOk  = JSON.stringify({

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
});

var AnswerWrongSurvey  = JSON.stringify({

    "timeSpent" : 18000,
    "surveyId" : "56df5ef85db1ea0b3b5bb8b6",
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
});

var answerUpdateOk = JSON.stringify({
    "timeSpent" : 22000,
    "updatedBy" : "56aa5eb95db1ea0b3b5bb8a0",
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
                            "answerGiven": "2"
                        },
                        {
                            "value" : "3",
                            "option" : "Crisis de 1929",
                            "answerGiven": "3"
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
});

var answerNoQuestions = JSON.stringify({
    "timeSpent" : 22000,
    "updatedBy" : "56aa5eb95db1ea0b3b5bb8a0",
    "sections" : [
        {
            "value" : 33.33
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
                            "answerGiven": "2"
                        },
                        {
                            "value" : "3",
                            "option" : "Crisis de 1929",
                            "answerGiven": "3"
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
});

var answerNoOptions = JSON.stringify({

    "timeSpent" : 22000,
    "updatedBy" : "56aa5eb95db1ea0b3b5bb8a0",
    "sections" : [
        {
            "value" : 100,
            "answers" : [
                {
                    "value" : 100,
                    "correctOptions" : 4,
                    "correctOptionType" : "matching",
                    "questionId" : "56df5ef85db1ea0b3b5bb8b6",
                    "options" : []
                }
            ]
        }
    ]
});

var answerWrongOptions = JSON.stringify({

    "timeSpent" : 22000,
    "updatedBy" : "56aa5eb95db1ea0b3b5bb8a0",
    "sections" : [
        {
            "value" : 100,
            "answers" : [
                {
                    "value" : 100,
                    "correctOptions" : 4,
                    "correctOptionType" : "matching",
                    "questionId" : "56df5ef85db1ea0b3b5bb8b6",
                    "options" : [
                        {
                            "answerGiven": "1"
                        },
                        {
                            "value" : "2",
                            "option" : "Independencia de México",
                            "answerGiven": "2"
                        },
                        {
                            "value" : "3",
                            "option" : "Crisis de 1929",
                            "answerGiven": "3"
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
});

var answerUpdateTypeUnknown = JSON.stringify({
    "timeSpent" : 22000,
    "updatedBy" : "56aa5eb95db1ea0b3b5bb8a0",
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
                            "value" : "3",
                            "option" : "Sencillo"
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
                    "correctOptionType" : "unknown",
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
                            "answerGiven": "2"
                        },
                        {
                            "value" : "3",
                            "option" : "Crisis de 1929",
                            "answerGiven": "3"
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
});

var answerQuantitativeNoMaxVal= JSON.stringify({
    "timeSpent" : 22000,
    "updatedBy" : "56aa5eb95db1ea0b3b5bb8a0",
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
                    ]
                },
                {
                    "value" : 60,
                    "correctOptions" : 2,
                    "correctOptionType" : "unknown",
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
                            "answerGiven": "2"
                        },
                        {
                            "value" : "3",
                            "option" : "Crisis de 1929",
                            "answerGiven": "3"
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
});

describe('Answer controller tests',function() {

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


    it('Must return 200 when answer has required and correct fields to be created, and also references to existing survey and questions',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer',
            method: 'POST',
            body: AnswerOk
        }, function(err,response,body) {

            var obj = JSON.parse(body);
            createdAnswerId = obj.id;

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.include.keys('id');
            chai.expect(obj.status).to.equal(200);
            chai.expect(obj.message).to.equal('Successfully created');
            done();
        });
    });

    it('Must return 400 when answer references to a non-existing survey',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer',
            method: 'POST',
            body: AnswerWrongSurvey
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.not.include.keys('id');
            chai.expect(obj.status).to.equal(400);
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj.error.message).to.equal('Answer validation failed');
            chai.expect(obj.error.name).to.equal('ValidationError');
            done();
        });
    });

    it('Must return 400 when same answer (same respondant and survey) has already been created',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer',
            method: 'POST',
            body: AnswerOk
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

    it('Must return 400 when id is not specified properly when getting an answer by id',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer/'+createdAnswerId+'kfdkfsd',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj.error.name).to.equal('CastError');
            chai.expect(obj.status).to.equal(400);

            done();
        });
    });

    it('Must return 404 when id is specified properly but nothing found trying to get an answer by id',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer/'+'56e06ab032222d88b6ebf600',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.error).to.equal('Answer object not found');

            done();
        });
    });

    it('Must return 404 when surveyId is specified properly but nothing found trying to get an answer',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answers/bySurvey/56e06ab032222d88b6ebf600',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.error).to.equal('Nothing found for this survey');

            done();
        });
    });

    it('Must return 404 when respondantId is specified properly but nothing found trying to get an answer',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answers/byRespondant/'+'101072265',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.error).to.equal('Nothing found for this respondant');

            done();
        });
    });

    it('Must return 404 when both ids are specified properly but nothing found trying to get an answer by survey and Respondant',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer/bySurveyRespondant/56e06ab032222d88b6ebf600/56e06ab032222d88b6ebf60a',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.error).to.equal('Answers not found with these parameters');

            done();
        });
    });


    it('Must return 200 and required object when id is specified properly and found after created',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer/'+createdAnswerId,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);
            attempts = obj.attempts;

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('status');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.include.keys('_id');
            chai.expect(obj.attempts).to.equal(1);


            done();
        });
    });

    it('Must return 200 and required object when surveyId is specified properly and found',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answers/bySurvey/'+surveyId,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('status');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.be.an('array');

            done();
        });
    });

    it('Must return 200 and required object when respondandId is specified properly and found',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answers/byRespondant/56ac5eb95db1ea0b3b5bb8aa',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('status');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.be.an('array');

            done();
        });
    });

    it('Must return 200 and required object when both ids are specified properly and found on getting by survey and respondant',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer/bySurveyRespondant/'+surveyId+'/56ac5eb95db1ea0b3b5bb8aa',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('status');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.be.an('array');

            done();
        });
    });

    it('Must return 400 when answer body is missing on create',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer',
            method: 'POST',
            body: JSON.stringify({})
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.not.include.keys('_id');
            chai.expect(obj.status).to.equal(400);
            chai.expect(obj.error).to.equal('Some mandatory fields are missing');
            done();
        });
    });

    it('Must return 400 when answer body has no surveyId',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer',
            method: 'POST',
            body: JSON.stringify({

                "timeSpent" : 18000,
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
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.not.include.keys('_id');
            chai.expect(obj.status).to.equal(400);
            chai.expect(obj.error).to.equal('Some mandatory fields are missing');
            done();
        });
    });

    it('Must return 400 when answer body has no respondantId',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer',
            method: 'POST',
            body: JSON.stringify({

                "timeSpent" : 18000,
                "surveyId" : surveyId,
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
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.not.include.keys('_id');
            chai.expect(obj.status).to.equal(400);
            done();
        });
    });

    it('Must return 400 when sections are empty',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer',
            method: 'POST',
            body: JSON.stringify({

                "timeSpent" : 18000,
                "surveyId" : surveyId,
                "respondant" : respondantObject,
                "sections" : []
            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.not.include.keys('_id');
            chai.expect(obj.status).to.equal(400);
            chai.expect(obj.error).to.equal('Some mandatory fields are missing');
            done();
        });
    });

    it('Must return 400 when questionId references a non-existing question',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
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
                                "questionId" : "56df5eb95db1ea0b3b5bb800",
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
                                "questionId" : "56df5e4f5db1ea0b3b5bb800",
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
                                "questionId" : "56df5eee5db1ea0b3b5bb800",
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
                                "questionId" : "56df5ef85db1ea0b3b5bb800",
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
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.not.include.keys('_id');
            chai.expect(obj.status).to.equal(400);
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj.error.message).to.equal('Answer validation failed');
            done();
        });
    });

    it('Must return 400 when answer body is missing on update',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer/'+createdAnswerId,
            method: 'PUT',
            body: JSON.stringify({})
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.not.include.keys('_id');
            chai.expect(obj.status).to.equal(400);
            chai.expect(obj.error).to.equal('No data provided to perform an answer update');
            done();
        });
    });

    it('Must return 200 when answer body has required fields in order to update',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer/'+createdAnswerId,
            method: 'PUT',
            body: answerUpdateOk
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            console.log(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.include.keys('id');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('message');
            chai.expect(obj.status).to.equal(200);
            chai.expect(obj.message).to.equal('Successfully updated');
            chai.expect(obj.id).to.equal(createdAnswerId);
            done();
        });
    });

    it('Must return 200 and attempts +1 after answer has been updated',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer/'+createdAnswerId,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('status');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.include.keys('_id');
            chai.expect(obj.attempts).to.equal(attempts+1);

            done();
        });
    });

    it('Must return 400 when id is wrong specified on updating',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer/56e07bfce9a7588abfc1cb00jgfjgfj',
            method: 'PUT',
            body: answerUpdateOk

        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj.error.name).to.equal('CastError');
            chai.expect(obj.status).to.equal(400);

            done();
        });
    });

    it('Must return 404 when id is well specified but element does not exist on updating',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer/56e07bfce9a7588abfc1cb00',
            method: 'PUT',
            body: answerUpdateOk

        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Answer object not found');
            chai.expect(obj.status).to.equal(404);

            done();
        });
    });

    it('Must return 400 when non-updatable parameters are detected in answer update request',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer/'+createdAnswerId,
            method: 'PUT',
            body: JSON.stringify({
                "respondant": respondantObject,
                "timeSpent" : 22000,
                "updatedBy" : "56df5eb95db1ea0b3b5bbab0",
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
                                        "answerGiven": "2"
                                    },
                                    {
                                        "value" : "3",
                                        "option" : "Crisis de 1929",
                                        "answerGiven": "3"
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

        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj.error).to.equal('Some parameters sent are non editable or some mandatory fields are missing');
            chai.expect(obj.status).to.equal(400);

            done();
        });
    });

    it('Must return 400 when control dates are detected in answer update request',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer/'+createdAnswerId,
            method: 'PUT',
            body: JSON.stringify({

                "registerDate": Date.now(),
                "timeSpent" : 22000,
                "updatedBy" : "56df5eb95db1ea0b3b5bb60a",
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
                                        "answerGiven": "2"
                                    },
                                    {
                                        "value" : "3",
                                        "option" : "Crisis de 1929",
                                        "answerGiven": "3"
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

        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj.error).to.equal('Control dates are not editable');
            chai.expect(obj.status).to.equal(400);

            done();
        });
    });

    it('Must return 400 when no answers detected inside a section', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer/'+createdAnswerId,
            method: 'PUT',
            body: answerNoQuestions
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj.error).to.equal('No answers given');
            chai.expect(obj.status).to.equal(400);

            done();
        });
    });

    it('Must return 400 when no options detected inside a question answer', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer/'+createdAnswerId,
            method: 'PUT',
            body: answerNoOptions
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj.error).to.equal('No options provided');
            chai.expect(obj.status).to.equal(400);

            done();
        });
    });

    it('Must return 400 when some option given has no value or option description', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer/'+createdAnswerId,
            method: 'PUT',
            body: answerWrongOptions
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj.error).to.equal('An option is not specified properly');
            chai.expect(obj.status).to.equal(400);

            done();
        });
    });

    it('Must set answer score to 0 when its correctOptionType is unknown', function(done){

        async.series([
            function(callback){

                request ({
                    headers: {
                        'x-access-token': adminToken,
                        'content-type': 'application/json'
                    },
                    uri: 'http://127.0.0.1:3001/v1/answer/'+createdAnswerId,
                    method: 'PUT',
                    body: answerUpdateTypeUnknown
                }, function(err,response,body) {

                    callback();

                });
            },
            function(callback){

                request ({
                    headers: {
                        'x-access-token': adminToken,
                        'content-type': 'application/json'
                    },
                    uri: 'http://127.0.0.1:3001/v1/answer/'+createdAnswerId,
                    method: 'GET'
                }, function(err,response,body) {

                    var obj = JSON.parse(body);
                    var sections = obj.sections;

                    for(var i = 0; i<sections.length; i++){

                        var answers = sections[i].answers;

                        for(var j = 0; j<answers.length; j++){

                            if(answers[j].correctOptionType === 'unknown'){

                                chai.expect(answers[j].score).to.equal(0);
                            }
                        }
                    }

                    callback();
                });
            }

        ], function(err){

            done();
        });

    });

    it('Must set answer score to 0 when its correctOptionType is quantitative and no maxVal parameter detected or equal to 0', function(done){

        async.series([
            function(callback){

                request ({
                    headers: {
                        'x-access-token': adminToken,
                        'content-type': 'application/json'
                    },
                    uri: 'http://127.0.0.1:3001/v1/answer/'+createdAnswerId,
                    method: 'PUT',
                    body: answerQuantitativeNoMaxVal
                }, function(err,response,body) {

                    callback();

                });
            },
            function(callback){

                request ({
                    headers: {
                        'x-access-token': adminToken,
                        'content-type': 'application/json'
                    },
                    uri: 'http://127.0.0.1:3001/v1/answer/'+createdAnswerId,
                    method: 'GET'
                }, function(err,response,body) {

                    var obj = JSON.parse(body);
                    var sections = obj.sections;

                    for(var i = 0; i<sections.length; i++){

                        var answers = sections[i].answers;

                        for(var j = 0; j<answers.length; j++){

                            if(answers[j].correctOptionType === 'quantitative'){

                                chai.expect(answers[j].score).to.equal(0);
                            }
                        }
                    }

                    callback();
                });
            }

        ], function(err){

            done();
        });

    });


    it('Must set answer score properly according to correctOptionType (Eg. If quantitative, it must take proportion according to maxVal)', function(done){

        async.series([
            function(callback){

                request ({
                    headers: {
                        'x-access-token': adminToken,
                        'content-type': 'application/json'
                    },
                    uri: 'http://127.0.0.1:3001/v1/answer/'+createdAnswerId,
                    method: 'PUT',
                    body: answerUpdateTypeUnknown
                }, function(err,response,body) {

                    callback();

                });
            },
            function(callback){

                request ({
                    headers: {
                        'x-access-token': adminToken,
                        'content-type': 'application/json'
                    },
                    uri: 'http://127.0.0.1:3001/v1/answer/'+createdAnswerId,
                    method: 'GET'

                }, function(err,response,body) {

                    var obj = JSON.parse(body);
                    var sections = obj.sections;

                    for(var i = 0; i<sections.length; i++){

                        var answers = sections[i].answers;

                        for(var j = 0; j<answers.length; j++){

                            switch (answers[j].correctOptionType){

                                case 'quantitative':

                                    chai.expect(answers[j].score).to.equal(15);
                                    break;

                                case 'truefalse':

                                    chai.expect(answers[j].score).to.equal(20);
                                    break;

                                case 'matching':

                                    chai.expect(answers[j].score).to.equal(60);
                                    break;

                                default:

                                    chai.expect(answers[j].score).to.equal(0);
                                    break;
                            }
                        }
                    }

                    callback();
                });
            }

        ], function(err){

            done();
        });
    });

    it('Must return 200 when getting results by survey and school properly',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/results/bySurveySchool/'+surveyId+'/'+respondantObject.schoolId,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('status');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.not.include.keys('_id');
            chai.expect(obj).to.be.an('array');

            done();
        });
    });

    it('Must return 200 when getting results by survey and period properly',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/results/bySurveyPeriod/'+surveyId+'/'+respondantObject.schoolPeriod,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('status');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.not.include.keys('_id');
            chai.expect(obj).to.be.an('array');

            done();
        });
    });

    it('Must return 200 when getting results by survey and school subject properly',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/results/bySurveySubject/'+surveyId+'/'+respondantObject.scholarity.schoolSubject,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('status');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.not.include.keys('_id');
            chai.expect(obj).to.be.an('array');

            done();
        });
    });

    it('Must return 200 when getting results by survey and school level properly',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/results/bySurveyLevel/'+surveyId+'/'+respondantObject.scholarity.schoolLevel,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('status');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.not.include.keys('_id');
            chai.expect(obj).to.be.an('array');

            done();
        });
    });

    it('Must return 200 when getting results by survey and scholarity properly',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/results/bySurveyScholarity/'+surveyId+'/'+respondantObject.scholarity.schoolLevel+'/'+respondantObject.scholarity.schoolRole+'/'+respondantObject.scholarity.schoolGrade,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('status');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.not.include.keys('_id');
            chai.expect(obj).to.be.an('array');

            done();
        });
    });

    it('Must return 200 when getting results by role properly',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/results/bySurveyRole/'+surveyId+'/'+respondantObject.scholarity.schoolLevel+'/'+respondantObject.scholarity.schoolRole,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('status');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.not.include.keys('_id');
            chai.expect(obj).to.be.an('array');

            done();
        });
    });

    it('Must return 200 when getting results by survey and group properly',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/results/bySurveyGroup/'+surveyId+'/'+respondantObject.schoolId+'/'+respondantObject.scholarity.schoolGrade+'/'+respondantObject.scholarity.schoolGroup,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('status');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.not.include.keys('_id');
            chai.expect(obj).to.be.an('array');

            done();
        });
    });

    it('Must return 404 when trying to get non-existing results by survey and school properly',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/results/bySurveySchool/56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Results not found with given parameters');

            done();
        });

    });

    it('Must return 404 when trying to get non-existing results by survey and period properly',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/results/bySurveyPeriod/56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Results not found with given parameters');

            done();
        });
    });


    it('Must return 404 when trying to get non-existing results by survey and school subject properly',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/results/bySurveySubject/56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Results not found with given parameters');

            done();
        });
    });

    it('Must return 404 when trying to get non-existing results by survey and school level properly',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/results/bySurveyLevel/56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Results not found with given parameters');

            done();
        });
    });

    it('Must return 404 when trying to get non-existing results by survey and scholarity properly',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/results/bySurveyScholarity/56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Results not found with given parameters');

            done();
        });
    });

    it('Must return 404 when trying to get non-existing results by survey and role properly',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/results/bySurveyRole/56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Results not found with given parameters');

            done();
        });
    });

    it('Must return 404 when trying to get non-existing results by survey and group properly',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/results/bySurveyGroup/56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Results not found with given parameters');

            done();
        });
    });

    it('Must return 400 when trying to get non-existing results by survey and school improperly',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/results/bySurveySchool/..56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(400);
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj).to.include.keys('error');

            done();
        });
    });

    it('Must return 400 when trying to get non-existing results by survey and period improperly',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/results/bySurveyPeriod/--56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(400);
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj).to.include.keys('error');

            done();
        });
    });

    it('Must return 400 when trying to get non-existing results by survey and school subject improperly',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/results/bySurveySubject/--56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(400);
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj).to.include.keys('error');

            done();
        });
    });

    it('Must return 400 when trying to get non-existing results by survey and school level improperly',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/results/bySurveyLevel/--56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(400);
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj).to.include.keys('error');

            done();
        });
    });
    it('Must return 400 when trying to get non-existing results by survey and scholarity improperly',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/results/bySurveyScholarity/--56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(400);
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj).to.include.keys('error');

            done();
        });
    });
    it('Must return 400 when trying to get non-existing results by survey and role improperly',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/results/bySurveyRole/--56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(400);
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj).to.include.keys('error');

            done();
        });
    });
    it('Must return 400 when trying to get non-existing results by survey and group improperly',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/results/bySurveyGroup/--56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800/56ac5eb95db1ea0b3b5bb800',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('object');
            chai.expect(obj.status).to.equal(400);
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj).to.include.keys('error');

            done();
        });
    });

    it('Must return 404 when trying to delete a non-existing answer', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer/56df5e4f5db1ea0b3b5bb8b0',
            method: 'DELETE'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Answer object not found');
            chai.expect(obj.status).to.equal(404);

            done();
        });

    });

    it('Must return 400 when trying to delete an answer through a wrong id', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer/hdashdhjashjdhjds',
            method: 'DELETE'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj.error.name).to.equal('CastError');
            chai.expect(obj.status).to.equal(400);

            done();
        });
    });

    it('Must return 200 when deleting an existing answer properly', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/answer/'+createdAnswerId,
            method: 'DELETE'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj.status).to.equal(200);
            chai.expect(obj.message).to.equal('Successfully deleted');
            chai.expect(obj).to.include.keys('id');
            chai.expect(obj.id).to.equals(createdAnswerId);

            done();
        });
    });
});