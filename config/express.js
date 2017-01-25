/**
 * Configuración de las dependencias de express
 *
 * @author Julio Bravo <jbravo@clb.unoi.com>
 * @version 1.0.0
 * @module config/express
 *
 */

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var utils = require('./utils');
var security = require('./security');

/**
 * Función que devuelve la aplicación con las dependencias utilizadas así como las rutas referenciadas
 *
 * @function exports
 * @returns {*}
 */

module.exports = function(){

    var app = express();
    app.use(morgan('dev'));

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    function setupCORS(req, res, next) {
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-type,Accept,X-Access-Token,X-Key');
        res.header('Access-Control-Allow-Origin', '*');
        if (req.method === 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    }

    app.all('/*', setupCORS);

    require('../app/routes/security')(app);
    require('../app/routes/answer')(app);
    require('../app/routes/user')(app);
    require('../app/routes/application')(app);
    require('../app/routes/statistics')(app);

    /* inicio isra */
    require('../app/routes/question')(app);
    require('../app/routes/questionType')(app);
    require('../app/routes/category')(app);
    require('../app/routes/survey')(app);
    require('../app/routes/result')(app);
    /* fin */

    app.use(express.static('public'));

    function returnInvalidJSON(err, req, res, next) {

        if (err) {

            res.status(400);
            res.json(utils.getResponseFormat(400,err.toString(),null));

        } else {

            next();
        }
    }

    function return404(req, res){

        res.status(404);
        res.json(utils.getResponseFormat(404,'Endpoint not found',null));
    }

    app.use(returnInvalidJSON);
    app.use(return404);

    return app;
};