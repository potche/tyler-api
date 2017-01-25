'use strict';

var async = require('async');
var mongoose = require('../config/mongoose');
var db = mongoose();
var AppDB = require('../app/models/application');
var qtDB = require('../app/models/questionType');
var catDB = require('../app/models/category');
var questionDB = require('../app/models/question');
var surveyDB = require('../app/models/survey');
var mongo = require('mongoose').mongo;

var qTypes = [
    {
        "_id" : mongo.ObjectId("56cb343a85bd0be118906095"),
        "questionType" : "Opción múltiple, una respuesta",
        "description" : "Preguntas de opción múltiple donde existe sólamente una opción correcta",
        "descriptiveImgPath" : "",
        "active" : true,
        "correctOptionType" : "truefalse",
        "createDate": new Date()
    },
    {
        "_id" : mongo.ObjectId("56cb34e885bd0be118906096"),
        "questionType" : "Opción multiple con más de una opción correcta",
        "description" : "Preguntas de opción múltiple donde es posible seleccionar más una opción correcta",
        "descriptiveImgPath" : "9129219921_32U2U3U2.png",
        "active" : true,
        "correctOptionType" : "truefalse",
        "createDate": new Date()
    },
    {
        "_id" : mongo.ObjectId("56cb510ebfbfa90225bc2daa"),
        "questionType" : "Ordenamiento",
        "description" : "los estudiantes deben organizar una serie de elementos en el orden o secuencia correcto",
        "descriptiveImgPath" : "",
        "active" : true,
        "correctOptionType" : "matching",
        "createDate": new Date()
    },
    {
        "_id" : mongo.ObjectId("56cb5169bfbfa90225bc2dab"),
        "questionType" : "Espacios en blanco, horizontal",
        "description" : "Llenar espacios en blanco de manera horizontal",
        "descriptiveImgPath" : "",
        "active" : true,
        "correctOptionType" : "matching",
        "createDate": new Date()
    },
    {
        "_id" : mongo.ObjectId("56cb518dbfbfa90225bc2dac"),
        "questionType" : "Espacios en blanco, vertical",
        "description" : "Llenar espacios en blanco de manera vertical",
        "descriptiveImgPath" : "",
        "active" : true,
        "correctOptionType" : "matching",
        "createDate": new Date()
    },
    {
        "_id" : mongo.ObjectId("56cb51abbfbfa90225bc2dad"),
        "questionType" : "Espacios en blanco, tabla",
        "description" : "Llenar espacios en tabla",
        "descriptiveImgPath" : "",
        "active" : true,
        "correctOptionType" : "matching",
        "createDate": new Date()
    },
    {
        "_id" : mongo.ObjectId("56cb55a0bfbfa90225bc2dae"),
        "questionType" : "Relacionar columnas",
        "description" : "Las preguntas de relacionar columnas (emparejamiento) tienen un área de contenido y una lista de nombres o de oraciones que deben de hacerse coincidir correctamente contra otra lista de nombres o de oraciones.",
        "descriptiveImgPath" : "",
        "active" : true,
        "correctOptionType" : "matching",
        "createDate": new Date()
    },
    {
        "_id" : mongo.ObjectId("56cb5619bfbfa90225bc2daf"),
        "questionType" : "Rúbrica",
        "description" : "La rúbrica es un instrumento de evaluación auténtica del desempeño de los estudiantes. En el presente documento se define y describe el proceso para elaborar las rúbricas, sus ventajas y desventajas.",
        "descriptiveImgPath" : "",
        "active" : true,
        "correctOptionType" : "quantitative",
        "createDate": new Date()
    }
];

var apps = [
    {
        "active" : true,
        "superAdmin" : false,
        "publicId" : "f964b2d0-8433-4a7c-b22b-bd4cb91e38b7",
        "applicationName" : "Ruta del Cambio v.1.0",
        "ssl" : true,
        "adminPassword" : "NDY4M2I0YzZjN2YyMTYwOGZkY2NkZDE2NzY5ODgyZTc0ZjVlY2Q0MmFlNDZiZDAzZmQwZDQ2ZGY4ZTRkYjBkZA==",
        "registerDate": new Date()
    },
    {
        "applicationName": 'Tyler UI',
        "active": true,
        "superAdmin": true,
        "ssl": false,
        "publicId": "37096689-100e-44ec-953f-57291af8a9b2",
        "adminPassword": "ZWIxZjA4MjFkMTM2OTVjOTU0NzM2MzY5ZTNiMzU2ZGNjZTkwODU3MDE4NTNlMzNiYmZhOGEwZDU2N2UzMWJiZA==",
        "registerDate": new Date()
    }
];

var demoQuestions = [
    {
        "_id" : mongo.ObjectId("56df5e4f5db1ea0b3b5bb8a4"),
        "active" : true,
        "categories" : [
            mongo.ObjectId("56df2a446bfa3acc1fb6fac7")
        ],
        "sandbox" : true,
        "options" : [
            {
                "order" : 1,
                "value" : "4",
                "option" : "Muy sencillo"
            },
            {
                "order" : 2,
                "value" : "3",
                "option" : "Sencillo"
            },
            {
                "order" : 3,
                "value" : "2",
                "option" : "Lo hago con dificultad"
            },
            {
                "order" : 4,
                "value" : "1",
                "option" : "Se me complica demasiado"
            },
            {
                "order" : 5,
                "value" : "0",
                "option" : "Estoy perdido"
            }
        ],
        "correctOptions" : 1,
        "maxVal" : 4,
        "assignments" : [
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
        ],
        "applicationId" : "37096689-100e-44ec-953f-57291af8a9b2",
        "questionTypeId" : mongo.ObjectId("56cb5619bfbfa90225bc2daf"),
        "createdBy" : 4389483,
        "createDate": new Date(),
        "modifyDate": new Date(),
        "question" : "¿Qué tan complicado para ti es realizar esta tarea? (DEMO)"
    },
    {
        "_id" : mongo.ObjectId("56df5eb95db1ea0b3b5bb8ac"),
        "active" : true,
        "categories" : [
            mongo.ObjectId("56df2a446bfa3acc1fb6fac7")
        ],
        "sandbox" : true,
        "options" : [
            {
                "order" : 1,
                "value" : "1",
                "option" : "Humano"
            },
            {
                "order" : 1,
                "value" : "0",
                "option" : "Reptil"
            }
        ],
        "correctOptions" : 1,
        "maxVal" : 0,
        "assignments" : [
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
        ],
        "applicationId" : "37096689-100e-44ec-953f-57291af8a9b2",
        "questionTypeId" : mongo.ObjectId("56cb343a85bd0be118906095"),
        "createdBy" : 4389483,
        "createDate": new Date(),
        "modifyDate": new Date(),
        "question" : "¿Cual es tu especie (DEMO)?"
    },
    {
        "_id" : mongo.ObjectId("56df5eee5db1ea0b3b5bb8b1"),
        "active" : true,
        "categories" : [
            mongo.ObjectId("56df2a446bfa3acc1fb6fac7")
        ],
        "sandbox" : true,
        "options" : [
            {
                "order" : 1,
                "value" : "Independencia",
                "option" : "_1"
            },
            {
                "order" : 2,
                "value" : "Mexicana",
                "option" : "_2"
            }
        ],
        "correctOptions" : 2,
        "maxVal" : 0,
        "assignments" : [
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
        ],
        "applicationId" : "37096689-100e-44ec-953f-57291af8a9b2",
        "questionTypeId" : mongo.ObjectId("56cb5169bfbfa90225bc2dab"),
        "createdBy" : 4389483,
        "createDate": new Date(),
        "modifyDate": new Date(),
        "question" : "La _1 es una fecha importante para la población _2 (DEMO)"
    },
    {
        "_id" : mongo.ObjectId("56df5ef85db1ea0b3b5bb8b6"),
        "active" : true,
        "categories" : [
            mongo.ObjectId("56df2a446bfa3acc1fb6fac7")
        ],
        "sandbox" : true,
        "options" : [
            {
                "order" : 1,
                "value" : "1",
                "option" : "Cruzadas"
            },
            {
                "order" : 2,
                "value" : "2",
                "option" : "Independencia de México"
            },
            {
                "order" : 2,
                "value" : "3",
                "option" : "Crisis de 1929"
            },
            {
                "order" : 2,
                "value" : "4",
                "option" : "Guerra fría"
            }
        ],
        "correctOptions" : 4,
        "maxVal" : 0,
        "assignments" : [
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
        ],
        "applicationId" : "37096689-100e-44ec-953f-57291af8a9b2",
        "questionTypeId" : mongo.ObjectId("56cb510ebfbfa90225bc2daa"),
        "createdBy" : 4389483,
        "createDate": new Date(),
        "modifyDate": new Date(),
        "question" : "Ordena los siguientes acontecimientos correctamente (DEMO)"
    },
    {
        "_id" : mongo.ObjectId("56df5f055db1ea0b3b5bb8bd"),
        "active" : true,
        "categories" : [
            mongo.ObjectId("56df2a446bfa3acc1fb6fac7")
        ],
        "sandbox" : true,
        "options" : [
            {
                "order" : 1,
                "value" : "1",
                "option" : "-9"
            },
            {
                "order" : 2,
                "value" : "0",
                "option" : "3"
            },
            {
                "order" : 3,
                "value" : "1",
                "option" : "9"
            },
            {
                "order" : 4,
                "value" : "0",
                "option" : "5"
            }
        ],
        "correctOptions" : 2,
        "maxVal" : 0,
        "assignments" : [
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
        ],
        "applicationId" : "37096689-100e-44ec-953f-57291af8a9b2",
        "questionTypeId" : mongo.ObjectId("56cb34e885bd0be118906096"),
        "createdBy" : 4389483,
        "createDate": new Date(),
        "modifyDate": new Date(),
        "question" : "¿Qué valores satisfacen la siguiente ecuación? <img src='/../img/aabfabfaffbabdf33.png'> (DEMO)"
    }
];

var demoSurvey = {

    "_id": mongo.ObjectId("5720e540276ae71c2095f86d"),
    "applicationId": "37096689-100e-44ec-953f-57291af8a9b2",
    "title": "Hardest survey of your entire life",
    "description": "This is a demo, please do not disturb if you don't like it",
    "instruction":  "Please answer",
    "createdBy": "56df5e4f5db1ea0b3b5bb8a4",
    "createDate": new Date(),
    "modifyDate": new Date(),
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
    }],
    "assignments": [
        {
            "schools": ["56df5e4f5db1ea0b3b5bb8a0"],
            "schoolPeriods": ["56df5e4f5db1ea0b3b5bb8a9"],
            "schoolSubjects": ["56df5e4f5db1ea0b3b5bb8a1","56df5e4f5db1ea0b3b5bb8a2"],
            "schoolGrades": ["56df5e4f5db1ea0b3b5bb8a3","56df5e4f5db1ea0b3b5bb8a2"],
            "roles": [
                {
                    "schoolLevel": "56df5e4f5db1ea0b3b5bb8a4",
                    "profile": "56df5e4f5db1ea0b3b5bb8a4"
                },
                {
                    "schoolLevel": "56df5e4f5db1ea0b3b5bb8a5",
                    "profile": "56df5e4f5db1ea0b3b5bb8a5"
                }
            ]
        }
    ]
};


async.series([

    function (callback) {

        console.log('Installing default applications');

        AppDB.collection.insert(apps,function(err,apps){

            if(err){

                console.log("There was an error inserting apps or apps may have already been inserted");
                callback();
            }

            else {

                console.log("Apps have been inserted correctly");
                callback();
            }

        });
    },
    function(callback){

        console.log('Installing default question types');

        qtDB.collection.insert(qTypes,function(err,qtypes){

            if(err){

                console.log("There was an error inserting Question Types or question types may have already been inserted");
                callback();
            }

            else {

                console.log("Question types have been created correctly");
                callback();
            }

        });
    },
    function(callback){

        var defCategory = {

            "_id": mongo.ObjectId("56df2a446bfa3acc1fb6fac7"),
            "category": "Default"
        };

        catDB.collection.insert([defCategory],function (err,cat) {

            if(err){

                console.log("There has been an error installing default category or it already exists");
                callback();

            }else{

                console.log("Default category installed successfully");
                callback();
            }
        });
    },
    function(callback){

        questionDB.collection.insert(demoQuestions,function (err,qs) {

            if(err){

                console.log("There has been an error installing questions or they might already exist");
                callback(err);

            }else{

                console.log("Demo questions installed successfully");
                callback();
            }
        });
    },
    function(callback){

        surveyDB.collection.insert([demoSurvey],function(err,su){

            if(err){

                console.log("Demo survey already exists");
                callback(err);
            }
            else{

                console.log("Demo survey installed successfully");
                callback();
            }
        });
    }], function(err){

            process.exit();
    }
);