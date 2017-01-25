/**
 * Modelo para usuarios
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 0.2.0
 * @module app/models/user
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({

    publicId: {

        type: String,
        unique: true,
        required: true
    },
    username: {

        type: String,
        unique: true,
        required: true
    },
    password: {

        type: String,
        required: true
    },
    isSuperAdmin:{

        type: Boolean,
        default: false,
        required: true
    },
    active:{

        type: Boolean,
        default: true,
        required: true
    },
    registerDate:{

        type: Date,
        default: new Date(),
        required: true
    },
    profileImgPath:{

        type: String
    }
},{
    versionKey: false
});

module.exports = mongoose.model('User',usersSchema);