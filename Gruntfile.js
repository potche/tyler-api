'use strict';

module.exports = function(grunt) {
    grunt.config.set('mochaTest', {
        test: {
            options: {
                timeout:           6000,
                reporter:          'mocha-sonar-reporter',
                quiet:             false,
                clearRequireCache: true
            },
            src:     ['test/*.js']
        }
    });
    grunt.loadNpmTasks('grunt-mocha-test');
};