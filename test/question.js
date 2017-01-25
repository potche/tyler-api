/**
 * Created by isra on 26/02/16.
 */
'use strict';

var server = require('../app/app.js');
var expect = require("chai").expect;
var request = require('request');
var async = require('async');

var getTokenOk = {
    "applicationId": "37096689-100e-44ec-953f-57291af8a9b2",
    "applicationPassword": "MGIxYTk2NGEwY2UxN2IxZjFkOTBiMThlYzA="
};

var getTokenOkNoAdmin = {
    "applicationId": "f964b2d0-8433-4a7c-b22b-bd4cb91e38b7",
    "applicationPassword": "MDViNTBjNjA5OTU5MTBhNGM1MGJjMDE0NDA="
};

var apiToken = '';
var apiTokenNoAdmin = '';
var apiTokenFalse = '65456as654654as65aretg';
var questionTypeId = '56cb343a85bd0be118906095';
var questionTypeIdP;
var categoryId,
    categoryId2,
    categoryId3;

var questionId,
    questionId2,
    questionId3,
    questionId4,
    questionId5,
    questionId6,
    questionId7;

var IdInvalidate = '123456';
var IdFalse = '56cb90a1b75ee38b423a6b11';

var category = {
    'category': 'Biología'
    },
    category2 = {
        'category': 'Geografia'
    },
    category3 = {
        'category': 'Matematicas'
    };

var update = {
    "updatedBy":  123456789,
    "categories" : [
        15521
    ],
    "options": [
        {
            "order" : 1,
            "value" : "0",
            "option" : "por que sí"
        },
        {
            "order" : 2,
            "value" : "0",
            "option" : "por el reflejo del mar"
        },
        {
            "order" : 3,
            "value" : "1",
            "option" : "debido a la manera en que la atmósfera interactúa con los rayos del sol"
        },
        {
            "order" : 4,
            "value" : "0",
            "option" : "Dios asi lo quiere"
        }
    ],
    "maxVal": 99
};

var qTypes = [
    {
        "_id" : "56cb343a85bd0be118906095",
        "questionType" : "Opción múltiple, una respuesta",
        "description" : "Preguntas de opción múltiple donde existe sólamente una opción correcta",
        "descriptiveImgPath" : "",
        "active" : true,
        "correctOptionType" : "truefalse"
    },
    {
        "_id" : "56cb34e885bd0be118906096",
        "questionType" : "Opción multiple con más de una opción correcta",
        "description" : "Preguntas de opción múltiple donde es posible seleccionar más una opción correcta",
        "descriptiveImgPath" : "9129219921_32U2U3U2.png",
        "active" : true,
        "correctOptionType" : "truefalse"
    },
    {
        "_id" : "56cb510ebfbfa90225bc2daa",
        "questionType" : "Ordenamiento",
        "description" : "los estudiantes deben organizar una serie de elementos en el orden o secuencia correcto",
        "descriptiveImgPath" : "",
        "active" : true,
        "correctOptionType" : "matching"
    },
    {
        "_id" : "56cb5169bfbfa90225bc2dab",
        "questionType" : "Espacios en blanco, horizontal",
        "description" : "Llenar espacios en blanco de manera horizontal",
        "descriptiveImgPath" : "",
        "active" : true,
        "correctOptionType" : "matching"
    },
    {
        "_id" : "56cb518dbfbfa90225bc2dac",
        "questionType" : "Espacios en blanco, vertical",
        "description" : "Llenar espacios en blanco de manera vertical",
        "descriptiveImgPath" : "",
        "active" : true,
        "correctOptionType" : "matching"
    },
    {
        "_id" : "56cb51abbfbfa90225bc2dad",
        "questionType" : "Espacios en blanco, tabla",
        "description" : "Llenar espacios en tabla",
        "descriptiveImgPath" : "",
        "active" : true,
        "correctOptionType" : "matching"
    },
    {
        "_id" : "56cb55a0bfbfa90225bc2dae",
        "questionType" : "Relacionar columnas",
        "description" : "Las preguntas de relacionar columnas (emparejamiento) tienen un área de contenido y una lista de nombres o de oraciones que deben de hacerse coincidir correctamente contra otra lista de nombres o de oraciones.",
        "descriptiveImgPath" : "",
        "active" : true,
        "correctOptionType" : "matching"
    },
    {
        "_id" : "56cb5619bfbfa90225bc2daf",
        "questionType" : "Rúbrica",
        "description" : "La rúbrica es un instrumento de evaluación auténtica del desempeño de los estudiantes. En el presente documento se define y describe el proceso para elaborar las rúbricas, sus ventajas y desventajas.",
        "descriptiveImgPath" : "",
        "active" : true,
        "correctOptionType" : "quantitative"
    }
];

var schoolId = '1209';
var schoolIdER = '12345';
var schoolIdFalse = '123456a';

var profileId = 18;
var levelId = 16;
var profileIdFalse = '18b';
var levelIdFalse = '16a';
var profileIdER = 16;
var levelIdER = 18;

var gradeId = '3';
var gradeIdFalse = '4b';
var gradeIdER = 2;

var schoolPeriodId = 19;
var schoolPeriodIdER = 20;
var schoolPeriodIdFalse = '19b';

var subjectId = 1;
var subjectIdER = 100;
var subjectIdFalse = '100a';

describe('question Controller', function () {
    before(function (done) {
        async.series([
            //Get Token Admin
            function (callback) {
                var dataJson = JSON.stringify(getTokenOk);
                request({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    uri: 'http://127.0.0.1:3001/v1/getCredentials',
                    body: dataJson,
                    method: 'POST'
                }, function (err, res, body) {
                    if (err) return callback(err);
                    var obj = JSON.parse(body);
                    apiToken = obj.apiToken;
                    callback();
                });
            },
            //Get Token No Admin
            function (callback) {
                var dataJson = JSON.stringify(getTokenOkNoAdmin);
                request({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    uri: 'http://127.0.0.1:3001/v1/getCredentials',
                    body: dataJson,
                    method: 'POST'
                }, function (err, res, body) {
                    if (err) return callback(err);
                    var obj = JSON.parse(body);
                    apiTokenNoAdmin = obj.apiToken;
                    callback();
                });
            }
        ], function (err) {
            //This function gets called after the four tasks have called their "task callbacks"
            done();
        });
    });

    it("post Category 401 (Invalid token)", function(done) {

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiTokenFalse
            },
            uri: 'http://127.0.0.1:3001/v1/category',
            body: JSON.stringify(category),
            method: 'POST'
        }, function (err, res, body) {
            var obj = JSON.parse(body);
            expect(obj.status).to.equal(401);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Authorization failed');

            done();
        });
    });

    it("post Category (parameters requireds)", function(done) {

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/category',
            method: 'POST'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(400);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Bad Request. Please review API Reference');

            done();
        });
    });

    it("post Category 200", function(done) {

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/category',
            body: JSON.stringify(category),
            method: 'POST'
        }, function (err, res, body) {
            var obj = JSON.parse(body);
            categoryId = obj.id;
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Successfully created');

            done();
        });
    });

    it("post Category2 200", function(done) {

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/category',
            body: JSON.stringify(category2),
            method: 'POST'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            categoryId2 = obj.id;
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Successfully created');

            done();
        });
    });

    it("post Category3 200", function(done) {

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/category',
            body: JSON.stringify(category3),
            method: 'POST'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            categoryId3 = obj.id;
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Successfully created');

            done();
        });
    });

    it("DELETE QuestionType 200 (ALL)", function(done) {

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questionTypes',
            method: 'DELETE'
        }, function (err, res, body) {
            var obj = JSON.parse(body);
            expect(obj.status).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Collection eliminated');

            done();
        });
    });

    it("get QuestionType All 404", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questionTypes',
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("post QuestionType 400 (batch)", function(done) {

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questionTypes/batch',
            body: JSON.stringify([]),
            method: 'POST'
        }, function (err, res, body) {
            var obj = JSON.parse(body);
            questionTypeIdP = obj.id;
            expect(res.statusCode).to.equal(400);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Bad Request. Please review API Reference');

            done();
        });
    });

    it("post QuestionType 400 (batch - parameters requireds)", function(done) {
        var qTypesE = [
            {
                "description" : "Preguntas de opción múltiple donde existe sólamente una opción correcta",
                "descriptiveImgPath" : "",
                "active" : true,
                "correctOptionType" : "truefalse"
            }
        ];
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questionTypes/batch',
            body: JSON.stringify(qTypesE),
            method: 'POST'
        }, function (err, res, body) {
            var obj = JSON.parse(body);
            questionTypeIdP = obj.id;
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');

            done();
        });
    });

    it("post QuestionType 200 (batch)", function(done) {

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questionTypes/batch',
            body: JSON.stringify(qTypes),
            method: 'POST'
        }, function (err, res, body) {
            var obj = JSON.parse(body);
            questionTypeIdP = obj.id;
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');

            done();
        });
    });

    it("post QuestionType 401 (Invalid token)", function(done) {
        var questionType = {
            'questionType': 'Opción múltiple, una respuesta',
            'description': 'Preguntas de opción múltiple donde existe sólamente una opción correcta',
            'descriptiveImgPath': '',
            'correctOptionType': 'truefalse'
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiTokenFalse
            },
            uri: 'http://127.0.0.1:3001/v1/questionType',
            body: JSON.stringify(questionType),
            method: 'POST'
        }, function (err, res, body) {
            var obj = JSON.parse(body);
            expect(obj.status).to.equal(401);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Authorization failed');

            done();
        });
    });

    it("post QuestionType 400 (parameters requireds)", function(done) {
        var questionType = {
            'description': 'Preguntas de opción múltiple donde existe sólamente una opción correcta',
            'descriptiveImgPath': ''
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questionType',
            body: JSON.stringify(questionType),
            method: 'POST'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(400);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Bad Request. Please review API Reference');

            done();
        });
    });

    it("post QuestionType (NoT Admin)", function(done) {
        var questionType = {
            'questionType': 'Opción múltiple, una respuesta',
            'description': 'Preguntas de opción múltiple donde existe sólamente una opción correcta',
            'descriptiveImgPath': '',
            'correctOptionType': 'truefalse'
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiTokenNoAdmin
            },
            uri: 'http://127.0.0.1:3001/v1/questionType',
            body: JSON.stringify(questionType),
            method: 'POST'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(403);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Endpoint not allowed');

            done();
        });
    });

    it("post QuestionType 200", function(done) {
        var questionType = {
            'questionType': 'prueba',
            'description': 'solo es prueba',
            'descriptiveImgPath': '',
            'correctOptionType': 'truefalse'
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questionType',
            body: JSON.stringify(questionType),
            method: 'POST'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            questionTypeIdP = obj.id;
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Successfully created');

            done();
        });
    });

    it("get QuestionType byId 404 (Id not match)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questionType/abc123',
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get QuestionType byId 404", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questionType/56cb343a85bd0be118906000',
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get QuestionType byId 200", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questionType/56cb343a85bd0be118906095',
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);

            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');

            done();
        });
    });

    it("get QuestionType All 200", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questionTypes',
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');

            done();
        });
    });

    it("delete QuestionType byId 404 (Id not match)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questionType/123abc',
            method: 'DELETE'
        }, function (err, res, body) {
            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("delete QuestionType 404 (Id not exists)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questionType/56df2a446bfa3acc1fb6fac7',
            method: 'DELETE'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("delete QuestionType 200", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questionType/'+questionTypeIdP,
            method: 'DELETE'
        }, function (err, res, body) {
            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('ID eliminated');

            done();
        });
    });

    it("post Question 401 (Invalid token)", function(done) {
        var question = {
            "question": "¿Qué especie eres?",
            "createdBy": '007',
            "categories": [categoryId],
            "questionTypeId": questionTypeId,
            "options": [1,2,3],
            "correctOptions": 1,
            "assignments":[
                {
                    "schools": [1209,1253],
                    "schoolPeriods": [19],
                    "schoolSubjects": [4],
                    "roles":[
                        {
                            "profile":[18],
                            "schoolLevel": 16,
                            "schoolGrades": [3]
                        }
                    ]
                }
            ]
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiTokenFalse
            },
            uri: 'http://127.0.0.1:3001/v1/question',
            body: JSON.stringify(question),
            method: 'POST'
        }, function (err, res, body) {
            var obj = JSON.parse(body);
            expect(obj.status).to.equal(401);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Authorization failed');

            done();
        });
    });

    it("post Question (parameters requireds)", function(done) {
        var question = {
            "question": "¿Qué especie eres?",
            "categories": [categoryId],
            "questionTypeId": questionTypeId,
            "options": [1,2,3],
            "correctOption": 1,
            "assignments":[
                {
                    "schools": [1209,1253],
                    "schoolPeriods": [19],
                    "schoolSubjects": [4],
                    "roles":[
                        {
                            "profile":[18],
                            "schoolLevel": 16,
                            "schoolGrades": [3]
                        }
                    ]
                }
            ]
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question',
            body: JSON.stringify(question),
            method: 'POST'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(400);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Bad Request. Please review API Reference');

            done();
        });
    });

    it("post Question incorrect questionTypeId", function(done) {
        var question = {
            "question": "¿Qué especie eres?",
            "createdBy": '007',
            "categories": [categoryId],
            "questionTypeId": '53165zxzxc5646as',
            "options": [1,2,3],
            "correctOptions": 1,
            "assignments":[
                {
                    "schools": [1209,1253],
                    "schoolPeriods": [19],
                    "schoolSubjects": [4],
                    "roles":[
                        {
                            "profile":[18],
                            "schoolLevel": 16,
                            "schoolGrades": [3]
                        }
                    ]
                }
            ]
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question',
            body: JSON.stringify(question),
            method: 'POST'
        }, function (err, res, body) {

            var obj = JSON.parse(body);

            expect(res.statusCode).to.equal(400);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Bad Request. Please review API Reference');

            done();
        });
    });

    it("post Question 400 (Empty body)", function(done) {

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question',
            method: 'POST'
        }, function (err, res, body) {

            var obj = JSON.parse(body);

            expect(res.statusCode).to.equal(400);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Bad Request. Please review API Reference');

            done();
        });
    });

    it("post Question 200", function(done) {
        var question = {
            "question": "¿Qué especie eres?",
            "createdBy": '007',
            "categories": [categoryId],
            "questionTypeId": questionTypeId,
            "options": [
                {
                    "option": "Mamifero",
                    "value": "1",
                    "order": 1
                },
                {
                    "option": "Insecto",
                    "value": "0",
                    "order": 2
                }
            ],
            "correctOption": 1,
            "assignments":[
                {
                    "schools": [1209,1253],
                    "schoolPeriods": [19],
                    "schoolSubjects": [4],
                    "roles":[
                        {
                            "profile":[18],
                            "schoolLevel": 16,
                            "schoolGrades": [3]
                        }
                    ]
                }
            ]
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question',
            body: JSON.stringify(question),
            method: 'POST'
        }, function (err, res, body) {
            var obj = JSON.parse(body);
            questionId = obj.id;
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Successfully created');

            done();
        });
    });

    it("post Question 2 (this question will be inactivated)", function(done) {
        var question = {
            "question": "¿Eres Terrestre?",
            "createdBy": '007',
            "categories": [categoryId, categoryId2],
            "questionTypeId": questionTypeId,
            "options": [
                {
                    "option": "Sí",
                    "value": "1",
                    "order": 1
                },
                {
                    "option": "No",
                    "value": "0",
                    "order": 2
                }
            ],
            "correctOption": 1,
            "assignments":[
                {
                    "schools": [1209,1253],
                    "schoolPeriods": [19],
                    "schoolSubjects": [4],
                    "roles":[
                        {
                            "profile":[18],
                            "schoolLevel": 16,
                            "schoolGrades": [3]
                        }
                    ]
                }
            ]
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiTokenNoAdmin
            },
            uri: 'http://127.0.0.1:3001/v1/question',
            body: JSON.stringify(question),
            method: 'POST'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            questionId2 = obj.id;
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Successfully created');

            done();
        });
    });

    it("put question enable 404 (Id not match)", function(done) {
        var enable = {
            "updatedBy":  333333333,
            "active": true
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/enable/' + IdInvalidate,
            body: JSON.stringify(enable),
            method: 'PUT'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("put question enable 401 (Id not exists)", function(done) {
        var enable = {
            "updatedBy":  333333333,
            "active": true
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/enable/'+questionId2,
            body: JSON.stringify(enable),
            method: 'PUT'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(401);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Authorization failed');

            done();
        });
    });

    it("put question enable 401 (Empty updatedBy)", function(done) {
        var enable = {
            "active": true
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/enable/' + questionId2,
            body: JSON.stringify(enable),
            method: 'PUT'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(400);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Bad Request. Please review API Reference');

            done();
        });
    });

    it("put question enable 401 (Empty active)", function(done) {
        var enable = {
            "updatedBy":  333333333
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/enable/' + questionId2,
            body: JSON.stringify(enable),
            method: 'PUT'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(400);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Bad Request. Please review API Reference');

            done();
        });
    });

    it("put question enable 409 (This question has already been Active/Inactive)", function(done) {
        var enable = {
            "updatedBy":  333333333,
            "active": true
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/enable/' + questionId,
            body: JSON.stringify(enable),
            method: 'PUT'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(409);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Update conflict. Update cancelled');

            done();
        });
    });

    it("put question enable 200", function(done) {
        var enable = {
            "updatedBy":  333333333,
            "active": false
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiTokenNoAdmin
            },
            uri: 'http://127.0.0.1:3001/v1/question/enable/' + questionId2,
            body: JSON.stringify(enable),
            method: 'PUT'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Successfully updated');

            done();
        });
    });

    it("put question 404 (Id not match)", function(done) {

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/' + IdInvalidate,
            body: JSON.stringify(update),
            method: 'PUT'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("put question 404 (Id not exists for applicationId)", function(done) {

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/'+questionId2,
            body: JSON.stringify(update),
            method: 'PUT'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(401);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Authorization failed');

            done();
        });
    });

    it("put question 401 (Empty updatedBy)", function(done) {
        var updateF = {
            "enable": 50
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/' + questionId2,
            body: JSON.stringify(updateF),
            method: 'PUT'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(400);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Bad Request. Please review API Reference');

            done();
        });
    });

    it("put question 409 (has already been inactived)", function(done) {

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiTokenNoAdmin
            },
            uri: 'http://127.0.0.1:3001/v1/question/' + questionId2,
            body: JSON.stringify(update),
            method: 'PUT'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(409);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Update conflict. Update cancelled');

            done();
        });
    });

    it("put question 200", function(done) {

        var update = {
            "updatedBy":  123456789,
            "categories" : [
                categoryId
            ],
            "options": [
                {
                    "order" : 1,
                    "value" : "0",
                    "option" : "por que sí"
                },
                {
                    "order" : 2,
                    "value" : "0",
                    "option" : "por el reflejo del mar"
                },
                {
                    "order" : 3,
                    "value" : "1",
                    "option" : "debido a la manera en que la atmósfera interactúa con los rayos del sol"
                },
                {
                    "order" : 4,
                    "value" : "0",
                    "option" : "Dios asi lo quiere"
                }
            ],
            "maxVal": 99
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/' + questionId,
            body: JSON.stringify(update),
            method: 'PUT'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Successfully updated');

            done();
        });
    });

    it("get question byId 401 (Invalid token)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiTokenFalse
            },
            uri: 'http://127.0.0.1:3001/v1/question/byId/' + questionId,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(401);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Authorization failed');

            done();
        });
    });

    it("get question byId 404 (Id not match)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/byId/' + IdInvalidate,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get question byId 404 (Id not Found)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/byId/' + IdFalse,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get question byId 404 (inactive)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/byId/' + questionId2,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get question byId 401 (id not exists for application)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiTokenNoAdmin
            },
            uri: 'http://127.0.0.1:3001/v1/question/byId/' + questionId,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            //console.log(obj);
            expect(obj.status).to.equal(401);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Authorization failed');

            done();
        });
    });

    it("get question byId 200", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/byId/' + questionId,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            //console.log(obj);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');

            done();
        });
    });

    it("get question bySchool 401 (Invalid token)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiTokenFalse
            },
            uri: 'http://127.0.0.1:3001/v1/questions/bySchool/' + schoolId,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(401);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Authorization failed');

            done();
        });
    });

    it("get question bySchool 404 (Id not match)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/bySchool/' + schoolIdFalse,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get question bySchool 404 (Empty records)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/bySchool/' + schoolIdER,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get question bySchool 200", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/bySchool/' + schoolId,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');

            done();
        });
    });

    it("get question byRol 401 (Invalid token)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiTokenFalse
            },
            uri: 'http://127.0.0.1:3001/v1/questions/byRol/' + profileId+'/'+ levelId,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            //console.log(obj.length);
            expect(obj.status).to.equal(401);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Authorization failed');

            done();
        });
    });

    it("get question byRol 404 (profileId not match)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/byRol/' + profileIdFalse+'/'+ levelId,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get question byRol 404 (levelId not match)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/byRol/' + profileId+'/'+ levelIdFalse,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get question byRol 404 (Empty records)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/byRol/' + profileIdER+'/'+ levelIdER,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get question byRol 200 (only id filtering)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/byRol/' + profileId+'/'+ levelId,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            //console.log(obj.length);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');

            done();
        });
    });

    it("post Question 3 (empty profile)", function(done) {
        var question = {
            "question": "¿cuanto es 1+1?",
            "createdBy": '007',
            "categories": [categoryId3],
            "questionTypeId": questionTypeId,
            "options": [
                {
                    "option": "3",
                    "value": "0",
                    "order": 1
                },
                {
                    "option": "2",
                    "value": "1",
                    "order": 2
                },
                {
                    "option": "1",
                    "value": "0",
                    "order": 3
                }
            ],
            "correctOption": 1,
            "assignments":[
                {
                    "schools": [1209,1253],
                    "schoolPeriods": [19],
                    "schoolSubjects": [4],
                    "roles":[
                        {
                            "schoolLevel": 16,
                            "schoolGrades": [3]
                        }
                    ]
                }
            ]
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question',
            body: JSON.stringify(question),
            method: 'POST'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            questionId3 = obj.id;
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Successfully created');

            done();
        });
    });

    it("get question byRol 200 (Empty parameters)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/byRol/' + profileIdER+'/'+ levelId,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            //console.log(obj.length);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');

            done();
        });
    });

    it("get question byGrade 401 (Invalid token)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiTokenFalse
            },
            uri: 'http://127.0.0.1:3001/v1/questions/byGrade/' + gradeId,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(401);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Authorization failed');

            done();
        });
    });

    it("get question byGrade 404 (Id not match)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/byGrade/' + gradeIdFalse,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get question byGrade 404 (Empty records)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/byGrade/' + gradeIdER,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get question byGrade 200 (only id filtering)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/byGrade/' + gradeId,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            //console.log(obj.length);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');

            done();
        });
    });

    it("put question 2 200", function(done) {

        var update = {
            "updatedBy":  123456789,
            "questionTypeId" : questionTypeId,
            "correctOptions": 1,
            "assignments": [
                {
                    "schools" : [
                        1209,
                        1253
                    ],
                    "schoolPeriods" : [
                        19
                    ],
                    "schoolSubjects" : [
                        4
                    ],
                    "roles" : [
                        {
                            "profile" : [
                                18
                            ],
                            "schoolGrades" : [
                                3
                            ],
                            "schoolLevel" : 16
                        }
                    ]
                }
            ]
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/' + questionId3,
            body: JSON.stringify(update),
            method: 'PUT'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Successfully updated');

            done();
        });
    });

    it("post Question 4 (empty grade)", function(done) {
        var question = {
            "question": "¿Por que es azul el cielo?",
            "createdBy": '007',
            "categories": [categoryId2],
            "questionTypeId": questionTypeId,
            "options": [
                {
                    "option": "por que sí",
                    "value": "0",
                    "order": 1
                },
                {
                    "option": "por el reflejo del mar",
                    "value": "0",
                    "order": 2
                },
                {
                    "option": "debido a la manera en que la atmósfera interactúa con los rayos del sol",
                    "value": "1",
                    "order": 3
                }
            ],
            "correctOption": 1,
            "assignments":[
                {
                    "schools": [1210],
                    "schoolPeriods": [19],
                    "schoolSubjects": [1],
                    "roles":[
                        {
                            "profile" : [15],
                            "schoolLevel": 12,
                            "schoolGrades": []
                        }
                    ]
                }
            ]
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiTokenNoAdmin
            },
            uri: 'http://127.0.0.1:3001/v1/question',
            body: JSON.stringify(question),
            method: 'POST'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            questionId4 = obj.id;
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Successfully created');

            done();
        });
    });

    it("get question byGrade 200 (empty grade)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/byGrade/' + gradeIdER,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            //console.log(obj);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get question bySchoolPeriod 401 (Invalid token)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiTokenFalse
            },
            uri: 'http://127.0.0.1:3001/v1/questions/bySchoolPeriod/' +schoolPeriodId,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(401);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Authorization failed');

            done();
        });
    });

    it("get question bySchoolPeriod 404 (Id not match)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/bySchoolPeriod/' + schoolPeriodIdFalse,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get question bySchoolPeriod 404 (Empty records)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/bySchoolPeriod/' + schoolPeriodIdER,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get question bySchoolPeriod 200 (only id filtering)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/bySchoolPeriod/' +schoolPeriodId,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            //console.log(obj.length);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');

            done();
        });
    });

    it("post Question 5 (empty grade)", function(done) {
        var question = {
            "question": "¿Cual es la 4 dimencion?",
            "createdBy": '007',
            "categories": [categoryId3],
            "questionTypeId": questionTypeId,
            "options": [
                {
                    "option": "3d + el tiempo",
                    "value": "1",
                    "order": 1
                },
                {
                    "option": "el plano",
                    "value": "0",
                    "order": 2
                },
                {
                    "option": "no existe",
                    "value": "0",
                    "order": 3
                }
            ],
            "correctOption": 1,
            "assignments":[
                {
                    "schools": [1210],
                    "schoolPeriods": [],
                    "schoolSubjects": [7],
                    "roles":[
                        {
                            "profile" : [15],
                            "schoolLevel": 12,
                            "schoolGrades": [6]
                        }
                    ]
                }
            ]
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question',
            body: JSON.stringify(question),
            method: 'POST'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            questionId5 = obj.id;
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Successfully created');

            done();
        });
    });

    it("get question bySchoolPeriod 200 (empty SchoolPeriod)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/bySchoolPeriod/' +schoolPeriodIdER,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            //console.log(obj.length);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');

            done();
        });
    });

    it("get question bySubject 401 (Invalid token)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiTokenFalse
            },
            uri: 'http://127.0.0.1:3001/v1/questions/bySubject/' +subjectId,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(401);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Authorization failed');

            done();
        });
    });

    it("get question bySubject 404 (Id not match)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/bySubject/' + subjectIdFalse,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get question bySubject 404 (Empty records)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/bySubject/' +subjectIdER,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            //console.log(obj);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.error).to.equal('Empty records');

            done();
        });
    });

    it("get question bySubject 200 (only id filtering)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiTokenNoAdmin
            },
            uri: 'http://127.0.0.1:3001/v1/questions/bySubject/' +subjectId,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');

            done();
        });
    });

    it("post Question 6 (empty Subject)", function(done) {
        var question = {
            "question": "¿Cuantos planetas hay en el sistema solar?",
            "createdBy": '007',
            "categories": [categoryId2],
            "questionTypeId": questionTypeId,
            "options": [
                {
                    "option": "10",
                    "value": "1",
                    "order": 1
                },
                {
                    "option": "9",
                    "value": "0",
                    "order": 2
                },
                {
                    "option": "8",
                    "value": "0",
                    "order": 3
                }
            ],
            "correctOption": 1,
            "assignments":[
                {
                    "schools": [1210],
                    "schoolPeriods": [19],
                    "schoolSubjects": [],
                    "roles":[
                        {
                            "profile" : [14],
                            "schoolLevel": 11,
                            "schoolGrades": [5]
                        }
                    ]
                }
            ]
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question',
            body: JSON.stringify(question),
            method: 'POST'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            questionId6 = obj.id;
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Successfully created');

            done();
        });
    });

    it("get question bySubject 200 (empty Subject)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/bySubject/' +subjectIdER,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');

            done();
        });
    });

    it("get question byGradeSubject 404 (gradeId not match)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/byGradeSubject/' + gradeIdFalse + '/' + subjectId,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get question byGradeSubject 404 (subjectId not match)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/byGradeSubject/' + gradeId + '/' + subjectIdFalse,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get question byGradeSubject 404 (Empty subjectIdER)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/byGradeSubject/' + gradeId + '/' + subjectIdER,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            //console.log(obj);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get question byGradeSubject 404 (Empty gradeId)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/byGradeSubject/' + gradeIdER + '/' + subjectId,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get question byGradeSubject 200 (only id filtering)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiTokenNoAdmin
            },
            uri: 'http://127.0.0.1:3001/v1/questions/byGradeSubject/' + gradeId + '/' + subjectId,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');

            done();
        });
    });

    it("post Question 7 (empty Grade Subject)", function(done) {
        var question = {
            "question": "¿Para que se usa la formula del chicharonero?",
            "createdBy": '007',
            "categories": [categoryId3],
            "questionTypeId": questionTypeId,
            "options": [
                {
                    "option": "para resolver ecuaciones de segundo grado",
                    "value": "1"
                },
                {
                    "option": "para calcular la venta",
                    "value": "0"
                },
                {
                    "option": "para calcular la preparacion",
                    "value": "0"
                },
                {
                    "option": "ninguna de las anteriores",
                    "value": "0"
                }
            ],
            "correctOption": 1,
            "assignments":[
                {
                    "schools": [1210],
                    "schoolPeriods": [19],
                    "schoolSubjects": [],
                    "roles":[
                        {
                            "profile" : [13],
                            "schoolLevel": 12,
                            "schoolGrades": []
                        }
                    ]
                }
            ]
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question',
            body: JSON.stringify(question),
            method: 'POST'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            questionId7 = obj.id;
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Successfully created');

            done();
        });
    });

    it("get question byGradeSubject 200 (empty Grade Subject)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/questions/byGradeSubject/' + gradeIdER + '/' + subjectIdER,
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            //console.log(obj.length);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');

            done();
        });
    });

    it("put question publish 401 (Invalid token)", function(done) {
        var published = {
            "publishedBy": 123456789
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiTokenFalse
            },
            uri: 'http://127.0.0.1:3001/v1/question/publish/' +questionId,
            body: JSON.stringify(published),
            method: 'PUT'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(obj.status).to.equal(401);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Authorization failed');

            done();
        });
    });

    it("put question publish 404 (Id not match)", function(done) {
        var published = {
            "publishedBy": 123456789
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/publish/' + IdInvalidate,
            body: JSON.stringify(published),
            method: 'PUT'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("put question publish 400 (Empty publishedBy)", function(done) {

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/publish/' + questionId,
            method: 'PUT'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(400);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Bad Request. Please review API Reference');

            done();
        });
    });

    it("put question publish 404 (id not found for applcationId)", function(done) {
        var published = {
            "publishedBy": 123456789
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiTokenNoAdmin
            },
            uri: 'http://127.0.0.1:3001/v1/question/publish/' + questionId,
            body: JSON.stringify(published),
            method: 'PUT'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(401);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Authorization failed');

            done();
        });
    });

    it("put question publish 409 (id Inactive)", function(done) {
        var published = {
            "publishedBy": 123456789
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiTokenNoAdmin
            },
            uri: 'http://127.0.0.1:3001/v1/question/publish/' +questionId2,
            body: JSON.stringify(published),
            method: 'PUT'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            //console.log(obj);
            expect(obj.status).to.equal(409);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Update conflict. Update cancelled');

            done();
        });
    });

    it("put question publish 200", function(done) {
        var published = {
            "publishedBy": 123456789
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/publish/' +questionId,
            body: JSON.stringify(published),
            method: 'PUT'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            //console.log(obj);
            expect(obj.status).to.equal(204);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Successfully updated');

            done();
        });
    });

    it("put question 409 (has already been published)", function(done) {

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/' + questionId,
            body: JSON.stringify(update),
            method: 'PUT'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(409);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Update conflict. Update cancelled');

            done();
        });
    });

    it("put question publish 409 (has already been published)", function(done) {
        var published = {
            "publishedBy": 123456789
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/publish/' +questionId,
            body: JSON.stringify(published),
            method: 'PUT'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            //console.log(obj);
            expect(obj.status).to.equal(409);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Update conflict. Update cancelled');

            done();
        });
    });

    it("delete category 404 (id not match)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/category/123abc',
            method: 'DELETE'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("delete category 401 (id not exists)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/category/56aa43bb8bc9f4856f558c15',
            method: 'DELETE'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(401);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Authorization failed');

            done();
        });
    });

    it("delete category 200", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/category/'+categoryId,
            method: 'DELETE'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Eliminated');

            done();
        });
    });

    it("delete category 2 200", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/category/'+categoryId2,
            method: 'DELETE'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Eliminated');

            done();
        });
    });

    it("delete category 3 200", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/category/'+categoryId3,
            method: 'DELETE'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Eliminated');

            done();
        });
    });

    it("delete question byId 404 (Id not match)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/123abc',
            method: 'DELETE'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("delete question byId 401 (Id not exists for applicationId)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/56e07ddc8f3c441d2fcb8e96',
            method: 'DELETE'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(401);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Authorization failed');

            done();
        });
    });

    it("delete question byId 200", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/'+questionId,
            method: 'DELETE'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('ID eliminated');

            done();
        });
    });

    it("delete question byId 2 200", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/'+questionId2,
            method: 'DELETE'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('ID eliminated');

            done();
        });
    });

    it("delete question byId 3 200", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/'+questionId3,
            method: 'DELETE'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('ID eliminated');

            done();
        });
    });

    it("delete question byId 4 200", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/'+questionId4,
            method: 'DELETE'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('ID eliminated');

            done();
        });
    });

    it("delete question byId 5 200", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/'+questionId5,
            method: 'DELETE'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('ID eliminated');

            done();
        });
    });

    it("delete question byId 6 200", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/'+questionId6,
            method: 'DELETE'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('ID eliminated');

            done();
        });
    });

    it("delete question byId 7 200", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/question/'+questionId7,
            method: 'DELETE'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('ID eliminated');

            done();
        });
    });

    it("get Category All 200", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/categories',
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            //console.log(obj);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');

            done();
        });
    });

    it("DELETE Categories 200 (ALL)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/categories',
            method: 'DELETE'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            expect(obj.status).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Eliminated');

            done();
        });
    });

    it("get Category All 404", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/categories',
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            //console.log(obj);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("post Category Defaul 200", function(done) {
        var categoryD = {
            "_id" : "56df2a446bfa3acc1fb6fac7",
            "category" : "Default"
        };

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/category',
            body: JSON.stringify(categoryD),
            method: 'POST'
        }, function (err, res, body) {
            //console.log(body);
            var obj = JSON.parse(body);
            categoryId = obj.id;
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Successfully created');

            done();
        });
    });

    it("get Category byId 404 (id not match)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/category/123abc',
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            //console.log(obj);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get Category byId 404 (id not found)", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/category/56cb343a85bd0be118906095',
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            //console.log(obj);
            expect(res.statusCode).to.equal(404);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it("get Category byId 200", function(done) {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': apiToken
            },
            uri: 'http://127.0.0.1:3001/v1/category/56df2a446bfa3acc1fb6fac7',
            method: 'GET'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            //console.log(obj);
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');

            done();
        });
    });
});