'use strict';

var server = require('../app/app.js');
var chai = require('chai');
var request = require('request');
var async = require('async');

var adminToken;
var demoUserDBId;
var demoUserPublicId = "563a7bc62daab45a1c402b8d";
var userObj = {

    "username" : "demoUser",
    'publicId': demoUserPublicId,
    "active" : true,
    "superAdmin" : false,
    "profileImgPath": "/img/55DDf86dbf8705054aa2f238_1.jpg"

};

describe('User tests', function(){

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

    it('Must return 404 when trying to get all users but are empty', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/users',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('message');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal("Resource not found");
            chai.expect(obj.error).to.equal("Empty set");
            done();
        });
    });

    it('Must return 200 ok with id and password when creating user from correct body', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/user',
            method: 'POST',
            body: JSON.stringify(userObj)
        }, function(err,response,body) {

            var obj = JSON.parse(body);
            demoUserDBId = obj.id;

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.include.keys('id');
            chai.expect(obj).to.include.keys('password');
            chai.expect(obj.message).to.equal("Successfully created");
            done();
        });
    });

    it('Must return 200 ok when trying to get existing user by id', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/user/'+demoUserDBId,
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.include.keys('_id');
            chai.expect(obj).to.be.an('object');
            done();
        });
    });

    it('Must return 200 ok when trying to get all users', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/users/',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.be.an('array');
            done();
        });
    });

    it('Must return 200 ok when trying to get existing user by username', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/user/byUsername/demoUser',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.include.keys('_id');
            chai.expect(obj).to.be.an('object');
            done();
        });
    });

    it('Must return 404 when trying to get non-existing user by username', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/user/byUsername/demoUserNotExists',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('message');
            chai.expect(obj.status).to.equal(404);
            chai.expect(obj.message).to.equal('Resource not found');
            chai.expect(obj.error).to.equal('User not found');
            done();
        });
    });

    it('Must return 400 when trying to get user by bad username', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/user/byUsername/#.',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj).to.include.keys('status');
            chai.expect(obj).to.include.keys('message');
            chai.expect(obj.status).to.equal(400);
            chai.expect(obj.message).to.equal('Bad Request. Please review API Reference');
            chai.expect(obj.error.name).to.equal('CastError');
            done();
        });
    });

    it('Must return 400 when trying to create user without one or more required fields', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/user',
            method: 'POST',
            body: JSON.stringify({

                "publicId": "55aaf86dbf8705054aa2f238",
                "active" : true,
                "superAdmin" : true,
                "profileImgPath": "/img/55DDf86dbf8705054aa2f238_1.jpg"

            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal("Bad Request. Please review API Reference");
            chai.expect(obj.error).to.equal("Some user fields are missing or not required");
            chai.expect(obj.status).to.equal(400);
            done();
        });
    });

    it('Must return 400 when trying to create user with an empty JSON body', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/user',
            method: 'POST',
            body: JSON.stringify({})
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal("Bad Request. Please review API Reference");
            chai.expect(obj.error).to.equal("Some user fields are missing or not required");
            chai.expect(obj.status).to.equal(400);
            done();
        });
    });

    it('Must return 400 when trying to create user sending own password', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/user',
            method: 'POST',
            body: JSON.stringify({

                "publicId": demoUserPublicId,
                "password": "insecure",
                "active" : true,
                "superAdmin" : true,
                "profileImgPath": "/img/55DDf86dbf8705054aa2f238_1.jpg"

            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal("Bad Request. Please review API Reference");
            chai.expect(obj.error).to.equal("Some user fields are missing or not required");
            chai.expect(obj.status).to.equal(400);
            done();
        });
    });

    it('Must return 400 when trying to create user whit a long username (more than 20 chars)', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/user',
            method: 'POST',
            body: JSON.stringify({

                "username" : "thisisaverylonglongsuperlongusername",
                "publicId": demoUserPublicId,
                "active" : true,
                "superAdmin" : true,
                "profileImgPath": "/img/55DDf86dbf8705054aa2f238_1.jpg"

            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal("Bad Request. Please review API Reference");
            chai.expect(obj.error).to.equal("Chosen username is too long, it must be 20 chars length maximum");
            chai.expect(obj.status).to.equal(400);
            done();
        });
    });

    it('Must return 200 ok when updating user correctly', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/user/'+demoUserDBId,
            method: 'PUT',
            body: JSON.stringify({

                'publicId': demoUserPublicId,
                "active" : true,
                "superAdmin" : true,
                "profileImgPath": "/img/55DDf86dbf8705054aa2f238_1.jpg"

            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.include.keys('id');
            chai.expect(obj.message).to.equal("Successfully updated");
            chai.expect(obj.status).to.equal(200);
            done();
        });
    });

    it('Must return 400 when trying to insert dups or users with the same publicId or username', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/user',
            method: 'POST',
            body: JSON.stringify(userObj)
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal("Bad Request. Please review API Reference");
            chai.expect(obj.error.code).to.equal(11000);
            chai.expect(obj.status).to.equal(400);
            done();
        });
    });

    it('Must return 400 when trying to get some user with a wrong id', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/user/kjfshkfhjkdsf',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal("Bad Request. Please review API Reference");
            chai.expect(obj.status).to.equal(400);
            done();
        });
    });

    it('Must return 404 when trying to get some user with a non-existing, but correct id', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/user/56aa43bb8bc9f4856f558c90',
            method: 'GET'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal("Resource not found");
            chai.expect(obj.error).to.equal("User not found");
            chai.expect(obj.status).to.equal(404);
            done();
        });
    });

    it('Must return 404 ok when when trying to update some user with a non-existing, but correct id', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/user/56aa43bb8bc9f4856f558c90',
            method: 'PUT',
            body: JSON.stringify({

                'publicId': demoUserPublicId,
                "active" : true,
                "superAdmin" : true,
                "profileImgPath": "/img/55DDf86dbf8705054aa2f238_1.jpg"

            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal("Resource not found");
            chai.expect(obj.error).to.equal("User not found");
            chai.expect(obj.status).to.equal(404);
            done();
        });
    });

    it('Must return 400 ok when when trying to update user registerDate', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/user/'+demoUserDBId,
            method: 'PUT',
            body: JSON.stringify({

                "active" : true,
                "superAdmin" : true,
                "registerDate": new Date()

            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal("Bad Request. Please review API Reference");
            chai.expect(obj.error).to.equal("Some user fields are not updateable or empty");
            chai.expect(obj.status).to.equal(400);
            done();
        });
    });

    it('Must return 400 ok when when trying to update username', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/user/'+demoUserDBId,
            method: 'PUT',
            body: JSON.stringify({

                "active" : true,
                "superAdmin" : true,
                "username": "uselessName"

            })
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal("Bad Request. Please review API Reference");
            chai.expect(obj.error).to.equal("Some user fields are not updateable or empty");
            chai.expect(obj.status).to.equal(400);
            done();
        });
    });

    it('Must return 400 ok when when an empty JSON body is sent for update', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/user/'+demoUserDBId,
            method: 'PUT',
            body: JSON.stringify({})
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal("Bad Request. Please review API Reference");
            chai.expect(obj.error).to.equal("Some user fields are not updateable or empty");
            chai.expect(obj.status).to.equal(400);
            done();
        });
    });

    it('Must return 400 when trying to update some user with a wrong id', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/user/kjfshkfhjkdsf',
            method: 'PUT',
            body: JSON.stringify({

                'publicId': demoUserPublicId,
                "active" : true,
                "superAdmin" : true,
                "profileImgPath": "/img/55DDf86dbf8705054aa2f238_1.jpg"

            })

        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal("Bad Request. Please review API Reference");
            chai.expect(obj.status).to.equal(400);
            done();
        });
    });

    it('Must return 400 when trying to delete some user with a wrong id', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/user/kjfshkfhjkdsf',
            method: 'DELETE'

        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(400);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal("Bad Request. Please review API Reference");
            chai.expect(obj.status).to.equal(400);
            done();
        });
    });

    it('Must return 404 ok when when trying to delete some user with a non-existing, but correct id', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/user/56aa43bb8bc9f4856f558c90',
            method: 'DELETE'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(404);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.include.keys('error');
            chai.expect(obj.message).to.equal("Resource not found");
            chai.expect(obj.error).to.equal("User not found");
            chai.expect(obj.status).to.equal(404);
            done();
        });
    });

    it('Must return 200 ok when deleting user correctly', function(done){

        request ({
            headers: {
                'x-access-token': adminToken,
                'content-type': 'application/json'
            },
            uri: 'http://127.0.0.1:3001/v1/user/'+demoUserDBId,
            method: 'DELETE'
        }, function(err,response,body) {

            var obj = JSON.parse(body);

            chai.expect(response.statusCode).to.equal(200);
            chai.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8');
            chai.expect(obj).to.not.include.keys('error');
            chai.expect(obj).to.include.keys('id');
            chai.expect(obj.message).to.equal("Successfully deleted");
            chai.expect(obj.status).to.equal(200);
            done();
        });
    });
});