/**
 *  Model Question
 *
 *  @author Isra Rey
 *  @version 1.0.0
 *  @module app/models/question
 *  @see https://www.npmjs.com/package/mongoose-id-validator
 */

var mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');
var QuestionType = require('../models/questionType');
var Category = require('../models/category');
var Schema = mongoose.Schema;

var questionSchema = new Schema({

    question: { type: String, unique: true, required: true },
    createdBy: { type: Number, required: true },
    publishedBy: { type: Number },
    updatedBy: { type: Number },
    active: { type: Boolean, required: true, default: true },
    categories: [{ type: Schema.Types.ObjectId, required: true, ref: 'Category' }],
    sandbox: { type: Boolean, required: true, default: true },
    createDate: { type: Date, required: true },
    modifyDate: { type: Date },
    publishDate: { type: Date },
    questionTypeId: { type: Schema.Types.ObjectId, required: true, ref: 'QuestionType' },
    options: [
        {
            option: {type: String, required: true},
            value: {type: String, required: true},
            order: {type: Number}
        }
    ],
    correctOptions: { type: Number, required: true, default: 1 },
    maxVal: {type: Number, default: 0},
    applicationId: { type: String, required: true },
    assignments: [
        {
            schools: [{type: Number}],
            schoolPeriods: [{type: Number}],
            schoolSubjects: [{type: Number}],
            roles:[
                {
                    schoolLevel: {type: Number},
                    profile: [{type: Number}],
                    schoolGrades: [{type: Number}]
                }
            ]
        }
    ]
}, {
    versionKey: false,
    toObject: {
        retainKeyOrder: true
    },
    toJSON: {
        retainKeyOrder: true
    }
});

questionSchema.plugin(idvalidator);

module.exports = mongoose.model('Question',questionSchema);