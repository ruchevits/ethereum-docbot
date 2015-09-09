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

                    /*var compounds = [];
                     console.log(compounds.length)

                     Q.fcall(function(){

                        return jsdoc.parse(dirname + '/repo');

                    }).then(function (jsdocCompounds) {

                        jsdocCompounds.forEach(function(compound){
                            compounds.push(compound);
                        });

                        console.log(jsdocCompounds.length)
                        console.log(compounds.length)

                        return markdown.parse(dirname + '/repo');

                    }).then(function (markdownCompounds) {

                        markdownCompounds.forEach(function(compound){
                            compounds.push(compound);
                        });

                        console.log(markdownCompounds.length)
                        console.log(compounds.length)

                        compounds.concat(markdownCompounds)

                    }).catch(function () {

                    }).done(function(){

                        return compounds;

                    });*/

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
