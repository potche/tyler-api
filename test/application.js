'use strict';

var server = require('../app/app.js');
var chai = require('chai');
var request = require('request');
var async = require('async');

var adminToken;
var demoAppHardId;

//Este id fue tomado del campo '_id' de una aplicación registrada en Darwin API
var demoAppPublicId = '56df4ad9b22d1aba1e92078e';
var publicId;


var updatedToken;

describe('Application tests', function(){

    before(function(done){

        async.series([

            function(callback){

                request({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    uri: 'http://127.0.0.1:3001/v1/getCredentials',
                    method: 'POST',
                    body: JSON.stringify({
                        "applicationId": "37096689-100e-44ec-953f-57291af8a9b2",
                        "applicationPassword": "MGIxYTk2NGEwY2UxN2IxZjFkOTBiMThlYzA="
                    })
                }, function (err, res, body) {

                    var obj = JSON.parse(body);
                    adminToken = obj.apiToken;

                    if(!err){

                        callback();
                    }
                });
            }

        ], function(err){

            done();

        });
    });

    it('Must return 200 ok with id and password when creating application from correct body', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/application',
            method: 'POST',
            body: JSON.stringify({

                "active" : true,
                "superAdmin" : false,
                "ssl" : true,
                "applicationName" : "Demo App"

            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);
            demoAppHardId = obj._id;

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.include.keys('applicationId');
            chai.expect(obj).to.include.keys('applicationPassword');
            chai.expect(obj).to.include.keys('_id');
            chai.expect(obj).to.include.keys('applicationId');
            done();
        });
    });

    it('Must return 400 bad request when creating application passing a publicId', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/application',
            method: 'POST',
            body: JSON.stringify({

                'publicId': demoAppPublicId,
                "active" : true,
                "superAdmin" : false,
                "ssl" : true,
                "applicationName" : "Demo App"

            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);


            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            done();
        });
    });

    it('Must return 400 when application data is not correct in the moment of insertion', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/application',
            method: 'POST',
            body: JSON.stringify({

                "ssl": false,
                "superAdmin": true,
                "active": true

            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');

            done();
        });

    });


    it('Must return 400 when some application parameter is not updatable', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/application/'+demoAppHardId,
            method: 'PUT',
            body: JSON.stringify({

                "_id": "56d8b3b20881207da87773cb",
                "ssl": false,
                "registerDate": "2016-03-03T21:59:14.329Z",
                "superAdmin": true,
                "active": true

            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);


            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj.error).to.equal('Some application fields are not updatable');
            done();
        });
    });

    it('Must return 400 when some application parameter is not accepted when created', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/application',
            method: 'POST',
            body: JSON.stringify({

                "publicId": "56be0ec521665eea2b9290a0",
                "ssl": false,
                "registerDate": "2016-03-03T21:59:14.329Z",
                "adminPassword": "jfdskjfdsjfjksdjkfsd",
                "superAdmin": true,
                "active": true

            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj.error).to.equal('Some application fields are not accepted');

            done();
        });
    });

    it('Must return 400 and error stack as error value when application id is not valid in URL', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/application/'+'hadsndasnad32',
            method: 'GET'

        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.error.name).to.equal('CastError');
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');

            done();
        });
    });

    it('Must return 404 and not found when application id does not exist but has a correct structure', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/application/'+demoAppPublicId,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.error).to.equal('Application not found');
            chai.expect(obj.message).to.equal('Resource not found');

            done();
        });
    });

    it('Must return 200 and one application when application id is valid and existing',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/application/'+demoAppHardId,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('_id');
            chai.expect(obj._id).to.equal(demoAppHardId);
            chai.expect(obj).to.include.keys('publicId');
            chai.expect(obj).to.include.keys('applicationName');
            chai.expect(obj).to.include.keys('adminPassword');
            chai.expect(obj).to.include.keys('active');
            chai.expect(obj).to.include.keys('registerDate');
            chai.expect(obj).to.include.keys('superAdmin');

            done();
        });
    });

    it('Must return 200 and new token when application is updated correctly', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/application/'+demoAppHardId,
            method: 'PUT',
            body: JSON.stringify({

                "applicationName" : "Demo App made Admin",
                "active": true,
                "superAdmin": true
            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);
            updatedToken = obj.credentials.apiToken;

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj.status).to.equal(204);
            chai.expect(obj.message).to.equal('Successfully updated, new credentials generated');
            chai.expect(obj).to.include.keys('credentials');

            done();
        });
    });

    it('Must return useful response with new token generated where application now is an admin', function(done){

        request ({
            headers: {

                'x-access-token': updatedToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/applications',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.be.an('array');
            chai.expect(obj).to.not.include.keys('status');
            chai.expect(obj).to.not.include.keys('message');
            chai.expect(obj).to.not.include.keys('error');

            done();
        });
    });

    it('Must return 404 when application id does not match any application on deleting', function(done){

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': adminToken
            },
            uri: 'http://127.0.0.1:3001/v1/application/565c9debf399bed013d49b9e',
            method: 'DELETE'
        }, function (err, res, body) {

            var obj = JSON.parse(body);

            chai.expect(res.statusCode).to.equal(404);
            chai.expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal('Resource not found');

            done();

        });
    });

    it('Must return 400 when applicationId does not have correct structure on delete', function(done){

        request({
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': adminToken
            },
            uri: 'http://127.0.0.1:3001/v1/application/balbalblalafd43',
            method: 'DELETE'
        }, function (err, res, body) {

            var obj = JSON.parse(body);
            chai.expect(res.statusCode).to.equal(400);
            chai.expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.error.name).to.equal('CastError');
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');

            done();

        });
    });

    it('Must return 200/204 and when application is deleted correctly', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/application/'+demoAppHardId,
            method: 'DELETE'
        }, function(err,response,body) {

            var obj = JSON.parse(body);
            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj.status).to.equal(204);
            chai.expect(obj.message).to.equal('Successfully deleted');

            done();
        });
    });
});