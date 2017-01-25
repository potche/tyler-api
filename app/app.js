/**
 * Configuración de la aplicación principal
 * @namespace app
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 1.0.0
 */


var env = require('../config/env');
var mongoose = require('../config/mongoose');
var express = require('../config/express');
var db = mongoose();
var app = express();

app.listen(env.port);
module.exports = app;