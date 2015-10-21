var Q = require('q');
var fs = require('fs-extra');
var glob = require("glob");
var marked = require('meta-marked');
var _ = require('lodash');

var helpers = require('../../helpers');

function parse(dirname) {

    console.log("Parsing with Markdown files: " + dirname);

    var renderer = new marked.Renderer();

    renderer.link = function (href, title, text) {

        var out = '<a href="javascript:void(0)" ng-click="openLink(\'' + href + '\')"';

        if (title) {
            out += ' title="' + title + '"';
        }

        out += '>' + text + '</a>';

        return out;

    };

    renderer.heading = function(text, level, raw) {
        return '<h'
            + level
            + ' id="'
            + this.options.headerPrefix
            + raw.toLowerCase().replace(/[^\w]+/g, '')
            + '">'
            + text
            + '</h'
            + level
            + '>\n';
    };

    marked.setOptions({
        renderer: renderer,
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: true
    });

    return Q.Promise(function(resolve, reject, notify) {

        var filepaths = glob.sync("**/*.md", {
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
            } else {
                language = "english";
                slug = filename.substring(0, filename.length - 3).toLowerCase();
            }

            name = slug.split('-').join(' ');

            var content = marked(data);

            if (!pages[slug]) {
                pages[slug] = {
                    slug: slug,
                    parser: 'marked',
                    kind: 'page',
                    summary: {},
                    body: {}
                };
            }

            pages[slug].summary[language] = {
                name: name,
                meta: content.meta
            };

            pages[slug].body[language] = {
                name: name,
                html: content.html
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
