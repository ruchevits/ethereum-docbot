var Q = require('q');
var fs = require('fs-extra');
var glob = require("glob");
var marked = require('marked');
var _ = require('lodash');

var helpers = require('../../helpers');

function parse(dirname) {

    console.log("Parsing with Markdown files: " + dirname);

    /*marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: true
    });*/

    return Q.Promise(function(resolve, reject, notify) {

        var filepaths = glob.sync("*.md", {
            cwd: dirname,
            realpath: true
        });

        var pages = {};

        filepaths.forEach(function(filepath){

            var filename = filepath.substr(filepath.lastIndexOf('/') + 1);

            var data = fs.readFileSync(filepath, 'utf8');

            var languageRegex = /\[(.*?)\]-/g;
            var matchedLanguage = languageRegex.exec(filename);

            var language, slug, name;

            if (matchedLanguage) {
                language = matchedLanguage[1].toLowerCase();
                slug = filename.substring(language.length + 3, filename.length - 3).toLowerCase();
                console.log(language)
                console.log(slug)
            } else {
                language = "english";
                slug = filename.substring(0, filename.length - 3).toLowerCase();
            }

            name = slug.split('-').join(' ');

            if (!pages[slug]) {
                pages[slug] = {
                    slug: slug,
                    parser: 'marked',
                    summary: {},
                    body: {}
                };
            }

            pages[slug].summary[language] = {
                name: name,
                kind: 'page'
            };

            pages[slug].body[language] = {
                name: name,
                kind: 'page',
                content: marked(data)
            };

        });

        var compounds = [];

        _.each(pages, function(page, slug){

            compounds.push(page);

        });

        resolve(compounds);

    });

}

module.exports = {
    parse: parse
};
