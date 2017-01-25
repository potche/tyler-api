/**
 *  Model QuestionType
 *
 *  @author Isra Rey
 *  @version 1.0.0
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionTypeSchema = new Schema({
    questionType: { type: String, unique: true, required: true },
    description: { type: String },
    descriptiveImgPath: { type: String },
    active: { type: Boolean, default: true },
    correctOptionType: { type: String, default: 'matching', required: true },
    createDate: { type: Date, default: new Date() }
}, {
    versionKey: false
});

module.exports = mongoose.model('QuestionType',questionTypeSchema);