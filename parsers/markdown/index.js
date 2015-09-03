var Q = require('q');
var fs = require('fs-extra');
var glob = require("glob");
var marked = require('marked');

var helpers = require('../../helpers');

function parse(dirname) {

    console.log("Parsing with Markdown files: " + dirname);

    return Q.Promise(function(resolve, reject, notify) {

        var filepaths = glob.sync("*.md", {
            cwd: dirname,
            realpath: true
        });

        var compounds = [];

        filepaths.forEach(function(filepath){

            var filename = filepath.substr(filepath.lastIndexOf('/') + 1);

            var data = fs.readFileSync(filepath, 'utf8');

            compounds.push({
                slug: filename,
                parser: 'markdown',
                body: {
                    language: 'en',
                    content: marked(data)
                }
            });


        });

        resolve(compounds);

    });

}

module.exports = {
    parse: parse
};
