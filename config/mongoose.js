/**
 * Configuración de mongoose
 *
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 1.0.0
 * @module config/mongoose
 *
 */

var env = require('./env');
var mongoose = require('mongoose');

module.exports = function(){
    var db = mongoose.connect(env.db);
    return db;
};
