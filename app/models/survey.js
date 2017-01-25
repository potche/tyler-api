/**
 * Modelo para evaluaciones
 *
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 1.0.0
 * @module app/models/survey
 */

var mongoose = require('mongoose');
var Question = require('./question');
var idValidator = require('mongoose-id-validator');
var Schema = mongoose.Schema;
var surveySchema = new Schema({

    title : {

        type : String,
        required : true
    },
    description : {

        type : String
    },
    instruction: {
        type : String
    },
    active : {

        type :Boolean,
        default : true,
        required : true
    },
    sandbox : {

        type :Boolean,
        default : true,
        required : true
    },
    createDate : {

        type : Date,
        required : true
    },
    startDate : {

        type : Date
    },
    publishDate : {

        type : Date
    },
    disableDate : {

        type : Date
    },
    modifyDate : {

        type : Date,
        required: true
    },
    createdBy : {

        type : String,
        required : true
    },
    modifiedBy : {

        type : String
    },

    publishedBy : {

        type : String
    },
    media : {

        type: Boolean,
        default : false,
        required : true
    },
    sectionRandom : {

        type: Boolean,
        default : false,
        required : true
    },
    sections : [{

        name : {

            type:String,
            required:true,
            default: 'Default'
        },
        sectionOrder : {

            type :Number,
            required : true
        },
        instruction : {

            type : String
        },
        introduction : {

            type : String
        },
        value : {

            type : Number,
            required : true,
            default: 100
        },
        settings : [{

            random : {

                type : Boolean,
                default : false,
                required : true
            },

            numQuestions : {

                type : Number,
                default: 1
            }
        }],
        questions:[{

            questionId : {

                type : Schema.Types.ObjectId,
                required : true,
                ref : 'Question'

            },
            value : {

                type : Number,
                required : true
            },
            order : {

                type : Number,
                required : true
            }
        }]
    }],

    timeLimit : {

        type : Number
    },
    applicationId : {

        type : String,
        required : true
    },
    assignments : [{

        schools : [{

            type : String
        }],

        schoolPeriods : [{

            type : String
        }],

        schoolSubjects : [{

            type : String
        }],

        schoolGrades: [{

            type : String
        }],

        roles : [{

            schoolLevel: {

                type : String
            },

            profile: {

                type : String
            }
        }]
    }]
},{
    versionKey: false
});

surveySchema.plugin(idValidator);
module.exports = mongoose.model('Survey',surveySchema);