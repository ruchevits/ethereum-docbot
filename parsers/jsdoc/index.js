var Q = require('q');
var glob = require("glob");
var jsdocParse = require("jsdoc-parse");

var helpers = require('../../helpers');

function parse(dirname) {

    console.log("Parsing with JsDoc files: " + dirname);

    return Q.Promise(function(resolve, reject, notify) {

        var filepaths = glob.sync("*.js", {
            cwd: dirname,
            realpath: true
        });

        var data = '';

        jsdocParse({
            src: filepaths
        }).on('data', function(chunk) {
            data += chunk;
        }).on('end', function() {
            var parsedData = JSON.parse(data);
            for (var i = 0; i < parsedData.length; i++) {
                var body = parsedData[i];
                parsedData[i] = {
                    slug: body.name,
                    parser: 'jsdoc',
                    body: body
                }
            }
            resolve(parsedData);
        });

    });

}

module.exports = {
    parse: parse
};
