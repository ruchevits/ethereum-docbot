var Q = require('q');
var fs = require('fs-extra');
var glob = require("glob");

var logger = require('../logger');

var doxygen = require('./doxygen');
var jsdoc = require('./jsdoc');
var markdown = require('./markdown');

function run(dirname, parser) {

    return Q.Promise(function(resolve, reject, notify) {

        return Q.fcall(function(){

            switch (parser) {

                case 'doxygen':
                    return doxygen.parse(dirname);

                case 'jsdoc':
                    return jsdoc.parse(dirname + '/repo');

                case 'markdown':
                    return markdown.parse(dirname + '/repo');

                default:
                    logger.info("Parser '" + parser + "' is not supported");
                    return [];

            }

        }).then(function(compounds){

            resolve(compounds);

        }).catch(function(err){

            reject(err);

        }).done(function(){

            logger.info("Parsing finished");

        });

    });

}

module.exports = {
    run: run
};
