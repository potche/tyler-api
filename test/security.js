'use strict';

var server = require('../app/app.js');
var chai = require('chai');
var request = require('request');
var Application = require('../app/models/application');
var async = require('async');

var nullToken = '';
var adminToken;
var trashedToken = 'hdashjdahjsdhjasd';
var expiredToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHBpcmluZyI6IjIwMTYtMDYtMTNUMTc6MDE6MzUuNzM4WiIsImFwcGxpY2F0aW9uSWQiOiIzNzA5NjY4OS0xMDBlLTQ0ZWMtOTUzZi01NzI5MWFmOGE5YjIiLCJhZG1pbiI6dHJ1ZX0.K_GRqbBgCxdKH6s9aE4H5Yy02V4HO6OjdicirrySj1Lh5g-4fMjeTURzKUrObqBubX4UghO2bFix7vNZUYRP-A';
var wrongPassword = 'M2E4NWNhNDZhYjMxNjJmMGY5ZDY2M2Y5FAA=';
var testAppId = "f964b2d0-8433-4a7c-b22b-bd4cb91e38b7";
var testAppPasswd = "MDViNTBjNjA5OTU5MTBhNGM1MGJjMDE0NDA=";
var testAppHardId;
var clientToken;
var clientDisabledToken;

describe('Security & access control tests',function() {


    before(function(done){

        async.series([

            function(callback){

                request({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    uri: 'http://127.0.0.1:3001/v1/getCredentials',
                    method: 'POST',
                    body:JSON.stringify({

                        "applicationId" : testAppId,
                        "applicationPassword" : testAppPasswd
                    })
                }, function (err, res, body) {

                        var obj = JSON.parse(body);
                        clientToken = obj.apiToken;
                        testAppHardId = obj._id;
                        callback();
                });
            },
            function(callback){

                request({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    uri: 'http://127.0.0.1:3001/v1/getCredentials',
                    method: 'POST',
                    body:JSON.stringify({

                        "applicationId" : "37096689-100e-44ec-953f-57291af8a9b2",
                        "applicationPassword" : "MGIxYTk2NGEwY2UxN2IxZjFkOTBiMThlYzA="
                    })
                }, function (err, res, body) {

                        var obj = JSON.parse(body);
                        adminToken = obj.apiToken;
                        callback();
                });
            }

        ], function(err){
            done();
        });
    });


    it('Must return 401 no token supplied when no token provided', function(done) {
        request ({
            headers: {
            },
            uri: 'http://127.0.0.1:3001/v1/applications',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(401);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj.message).to.equal('Authorization failed');
            chai.expect(obj.error).to.equal('Error: No token supplied');

            done();
        });
    });

    it('Must return 401 no token supplied when token is null or an empty string', function(done) {
        request ({
            headers: {
                'x-access-token': nullToken
            },
            uri: 'http://127.0.0.1:3001/v1/applications',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(401);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj.message).to.equal('Authorization failed');
            chai.expect(obj.error).to.equal('Error: No token supplied');

            done();
        });
    });

    it('Must return 401 Token expired when token is no longer date-valid', function(done) {

        request ({
            headers: {
                'x-access-token': expiredToken
            },
            uri: 'http://127.0.0.1:3001/v1/questionTypes',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(401);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj.message).to.equal('Authorization failed');
            chai.expect(obj.error).to.equal('Token has expired');

            done();
        });
    });

    it('Must return 401 application is not active when an application tries to perform some API request and is not active',function(done){

        async.series([

            function(callback){

                request ({
                    headers: {
                        'x-access-token': adminToken,
                        'content-type': 'application/json'
                    },
                    uri: 'http://127.0.0.1:3001/v1/application/'+testAppHardId,
                    method: 'PUT',
                    body: JSON.stringify({

                        "active": false
                    })
                }, function(err,response,body) {

                    var obj = JSON.parse(body);
                    clientDisabledToken = obj.credentials.apiToken;

                    callback();
                });
            },
            function(callback){

                request ({
                    headers: {
                        'x-access-token': clientDisabledToken
                    },
                    uri: 'http://127.0.0.1:3001/v1/questionTypes',
                    method: 'GET'

                }, function(err,response,body) {

                    var obj = JSON.parse(body);

                    chai.expect(response.statusCode).to.equal(401);
                    chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
                    chai.expect(obj.message).to.equal('Authorization failed');
                    chai.expect(obj.error).to.equal('Application is not active');
                    callback();
                });
            },
            function(callback){

                request ({
                    headers: {
                        'x-access-token': adminToken,
                        'content-type': 'application/json'
                    },
                    uri: 'http://127.0.0.1:3001/v1/application/'+testAppHardId,
                    method: 'PUT',
                    body: JSON.stringify({

                        "active": true
                    })
                }, function(err,response,body) {

                    var obj = JSON.parse(body);
                    clientToken = obj.credentials.apiToken;
                    callback();
                });
            }

        ], function(err){

            done();
        })
    });

    it('Must return 401 Not enough or too many segments when token is trash',function(done){

        request ({
            headers: {
                'x-access-token': trashedToken
            },
            uri: 'http://127.0.0.1:3001/v1/applications',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(401);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj.message).to.equal('Authorization failed');
            chai.expect(obj.error).to.equal('Error: Not enough or too many segments');

            done();
        });
    });

    it('Must return 404 endpoint not found when endpoint does not exist',function(done){

        request ({
            headers: {
                'x-access-token': clientToken
            },
            uri: 'http://127.0.0.1:3001/v1/endpointdoesnotexist',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('Endpoint not found');

            done();
        });
    });

    it('Must return 400 when JSON body is malformed',function(done){

        request ({
            headers: {
                'content-type': 'application/json',
                'x-access-token': clientToken
            },
            uri: 'http://127.0.0.1:3001/v1/answer',
            method: 'POST',
            body: '{a"".:.."asdads"}'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj.error).to.match(/^SyntaxError/);

            done();
        });
    });

    it('Must return 400 when application data is missing to get credentials',function(done){

        request ({
            headers: {
                'content-type': 'application/json',
                'x-access-token': clientToken
            },
            uri: 'http://127.0.0.1:3001/v1/getCredentials',
            method: 'POST',
            body: JSON.stringify({})
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj.error).to.equal('Application data is missing');

            done();
        });
    });

    it('Must return 401 Wrong password when password is incorrect ',function(done){

        request ({
            headers: {
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/getCredentials',
            method: 'POST',
            body: JSON.stringify({
                'applicationId' : testAppId,
                'applicationPassword': wrongPassword
            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(401);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj.message).to.equal('Authorization failed');
            chai.expect(obj.error).to.equal('Wrong application id or password');

            done();
        });
    });

    it('Must return 200 with token, right expiring date and app id when credentials are correct',function(done){

        request ({
            headers: {
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/getCredentials',
            method: 'POST',
            body: JSON.stringify({
                'applicationId' : testAppId,
                'applicationPassword': testAppPasswd
            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);
            var expDate = new Date();
            expDate.setDate(expDate.getDate() + 30);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj["applicationId"]).to.equal(testAppId);
            chai.expect(obj["apiToken"]).to.be.a('string');
            chai.expect(new Date(obj["expirationDate"])).to.be.at.most(expDate);

            done();
        });
    });

    it('Must return 403 forbidden when an applications tries to access an administrative endpoint',function(done){

        request ({
            headers: {
                'x-access-token': clientToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/applications',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(403);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj.message).to.equal('Endpoint not allowed');
            chai.expect(obj.error).to.equal('This application has no access to this endpoint');

            done();
        });
    });

    it('Must return 200 ok when an administrative application tries to access an administrative endpoint',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/applications',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');

            done();
        });
    });

    it('Must return 405 when method is not allowed',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/applications',
            method: 'POST'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(405);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj.message).to.equal('Method not allowed');

            done();
        });
    });

    it('Must return 200 when OPTIONS method is performed',function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/fnjdjknfdsjk',
            method: 'OPTIONS'
        }, function(err,response,body) {

            chai.expect(response.statusCode).to.equal(200);
            done();
        });
    });



});