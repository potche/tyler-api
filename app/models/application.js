/**
 * Modelo para aplicaciones
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 1.0.0
 * @module app/models/application
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appsSchema = new Schema({

    publicId : {

        type: String,
        unique: true,
        required: true
    },
    applicationName: {

        type: String,
        unique: true,
        required: true
    },
    active: {
        type: Boolean,
        default: true,
        required: true
    },
    ssl: Boolean,
    adminPassword: {
        type: String,
        required: true
    },
    superAdmin:{
        type: Boolean,
        default: false,
        required: true
    },
    registerDate: {
        type: Date,
        default: new Date(),
        required: true
    }
},{
    versionKey: false
});

module.exports = mongoose.model('Application',appsSchema);