var Q = require('q');
var fs = require('fs-extra');
var xamel = require('xamel');
var spawn = require('child_process').spawn;

var config = require('../../config');
var logger = require('../../logger');

var compounddefType = require('./types/compounddef');

function parse(dirname) {

    console.log("Parsing with Doxygen directory: " + dirname);

    return Q.Promise(function(resolve, reject, notify) {

        return Q.fcall(function(){

            return Q.Promise(function(resolve, reject, notify) {

                var doxygenOptions = [
                    config.root + '/parsers/doxygen/Doxyfile'
                ];

                // Parse source files with Doxygen
                var doxygen = spawn('doxygen', doxygenOptions, {
                    cwd: dirname
                });

                doxygen.stdout.on('data', function (data) {
                    // Child process hangs without this
                    //console.log('stdout: ' + data);
                 });

                doxygen.stderr.on('data', function (data) {
                    //reject(data)
                 });

                doxygen.on('exit', function (code) {
                    if (code !== 0) {
                        reject(new Error("Doxygen failed to parse project"));
                    }
                    resolve();
                });

            });

        }).then(function(){

            return Q.Promise(function(resolve, reject, notify) {

                var data = '';

                // Combine XML documents with Xsltproc
                var xsltproc = spawn('xsltproc', [
                    'combine.xslt',
                    'index.xml'
                ], {
                    cwd: dirname + '/docs/xml'
                });

                xsltproc.stdout.on('data', function (chunk) {
                    data += chunk;
                });

                /*xsltproc.stderr.on('data', function (data) {
                    reject(data);
                });*/

                xsltproc.on('exit', function (code) {
                    resolve(data);
                });

            });

        }).then(function(xml){

            return Q.Promise(function(resolve, reject, notify) {

                xamel.parse(xml, {
                    buildPath : 'doxygen/compounddef'
                }, function(err, parsedXml) {

                    if (err !== null) {
                        throw err;
                    }

                    resolve(parsedXml.children);

                });

            });

        }).then(function(compounddefs){

            var compounds = [];

            compounddefs.forEach(function(compounddef){
                compounds.push(compounddefType(compounddef));
            });

            resolve(compounds);

        }).catch(function(err){

            reject(err);

        }).done(function(){

            logger.info('Doxygen finished working');

        });

    });

}

module.exports = {
    parse: parse
};
