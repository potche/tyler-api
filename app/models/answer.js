/**
 * Modelo para respuestas
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 1.0.0
 * @module app/models/answers
 */

var mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');
var Question = require('./question');
var Survey = require('./survey');
var Schema = mongoose.Schema;

var answersSchema = new Schema({

    respondant: {

        respondantId: {

            type: String,
            required: true
        },
        schoolId: {
            type: String
        },
        applicationId:{

            type: String,
            required: true
        },
        schoolPeriod:{

            type: String,
            required: true
        },
        scholarity:{

            schoolRole:{

                type: String,
                required: true
            },
            schoolLevel:{

                type: String,
                required: true
            },
            schoolSubject: {

                type: String
            },
            schoolGrade:{

                type: String
            },
            schoolGroup:{

                type: String
            }
        }
    },
    surveyId: {

        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Survey'
    },
    registerDate:{

        type: Date,
        required: true
    },
    lastAttemptDate:{

        type: Date,
        default: new Date()
    },
    lastUpdateDate:{

        type: Date,
        required:true
    },
    updatedBy:{

        type: String
    },
    timeSpent:{

        type:Number
    },
    attempts:{

        type:Number,
        default: 0
    },
    score:{
        type: Number,
        default: 0.0,
        min: 0, max: 100
    },
    sections:[{

        value: {
            type:Number,
            required: true,
            min: 0, max: 100
        },
        score: {
            type:Number,
            required: true,
            default: 0.0
        },
        answers:[{
            questionId:{

                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Question'
            },
            correctOptionType:{
                type:String,
                required: true
            },
            correctOptions:{
                type:Number,
                required: true
            },
            value: {
                type:Number,
                required: true,
                default: 0,
                min: 0, max: 100
            },
            score: {

                type: Number,
                required: true,
                default: 0.0,
                min: 0, max: 100
            },
            maxVal:{
                type: Number,
                default: 0
            },
            options: [{

                option: {
                    type: String,
                    required: true
                },
                value:{

                    type: String,
                    required: true
                },
                answerGiven:{

                    type: String
                }
            }]
        }]
    }]
},{
    versionKey: false
});

answersSchema.plugin(idvalidator);
answersSchema.index({ respondant: 1, surveyId: 1}, { unique: true });
module.exports = mongoose.model('Answer',answersSchema);