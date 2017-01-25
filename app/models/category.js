/**
 *  Model Category
 *
 *  @author Isra Rey
 *  @version 1.0.0
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    category: { type: String, unique: true, required: true },
    active: { type: Boolean, default: true },
    createDate: { type: Date, default: new Date()}
}, {
    versionKey: false
});

module.exports = mongoose.model('Category',categorySchema);