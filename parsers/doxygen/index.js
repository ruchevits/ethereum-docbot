var Q = require('q');
var fs = require('fs-extra');
var glob = require("glob");
var path = require('path');
var xamel = require('xamel');
var spawn = require('child_process').spawn;

var config = require('../../config');

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

                /*doxygen.stdout.on('data', function (data) {
                 console.log('stdout: ' + data);
                 });*/

                /*doxygen.stderr.on('data', function (data) {
                    reject(data)
                });*/

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
                    //console.log(data)
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

                    //console.dir(JSON.stringify(parsedXml));

                    resolve(parsedXml.children);

                });

            });

        }).then(function(compounddefs){

            var compounds = [];

            compounddefs.forEach(function(compounddef){
                compounds.push({
                    slug: compounddef.attrs.id,
                    parser: 'doxygen',
                    body: parseCompounddef(compounddef)
                });
            });

            resolve(compounds);

        }).catch(function(err){

            reject(err);

        }).done(function(){

            // TODO: log

        });

    });

}

function parseCompounddef(compounddef){

    var compound = {
        kind: compounddef.attrs.kind,
        name: compounddef.$('compoundname').text()
    };



    var title = compounddef.$('title').text();
    if (title) {
        compound.title = title;
    }



    // console.dir(JSON.stringify(compounddef.$('basecompoundref')));



    var includes = [];
    compounddef.$('includes').reduce(function(query, key) {
        includes.push({
            refid: key.attr('refid'),
            isLocal: (key.attr('local') === 'yes'),
            name: key.text()
        });
    }, '');

    if (includes.length) {
        compound.includes = includes;
    }



    var includedby = [];
    compounddef.$('includedby').reduce(function(query, key) {
        includedby.push({
            refid: key.attr('refid'),
            isLocal: (key.attr('local') === 'yes'),
            name: key.text()
        });
    }, '');

    if (includedby.length) {
        compound.includedby = includedby;
    }



    //console.dir(JSON.stringify(compounddef.$('incdepgraph')));
    //console.dir(JSON.stringify(compounddef.$('invincdepgraph')));



    compound.inner = {};



    var innerdir = [];
    compounddef.$('innerdir').reduce(function(query, key) {
        innerdir.push({
            refid: key.attr('refid'),
            name: key.text()
        });
    }, '');

    if (innerdir.length) {
        compound.inner.dirs = innerdir;
    }



    var innerfile = [];
    compounddef.$('innerfile').reduce(function(query, key) {
        innerfile.push({
            refid: key.attr('refid'),
            name: key.text()
        });
    }, '');

    if (innerfile.length) {
        compound.inner.files = innerfile;
    }



    var innerclass = [];
    compounddef.$('innerclass').reduce(function(query, key) {
        innerclass.push({
            refid: key.attr('refid'),
            prot: key.attr('prot'),
            name: key.text()
        });
    }, '');

    if (innerclass.length) {
        compound.inner.classes = innerclass;
    }



    var innernamespace = [];
    compounddef.$('innernamespace').reduce(function(query, key) {
        innernamespace.push({
            refid: key.attr('refid'),
            name: key.text()
        });
    }, '');

    if (innernamespace.length) {
        compound.inner.namespaces = innernamespace;
    }



    var innerpage = [];
    compounddef.$('innerpage').reduce(function(query, key) {
        innerpage.push({
            refid: key.attr('refid'),
            name: key.text()
        });
    }, '');

    if (innerpage.length) {
        compound.inner.pages = innerpage;
    }



    var innergroup = [];
    compounddef.$('innergroup').reduce(function(query, key) {
        innergroup.push({
            refid: key.attr('refid'),
            name: key.text()
        });
    }, '');

    if (innergroup.length) {
        compound.inner.groups = innergroup;
    }



    //console.dir(JSON.stringify(compounddef.$('templateparamlist')));



    //console.dir(JSON.stringify(compounddef.$('sectiondef')));
    var sectiondef = [];
    compounddef.$('sectiondef').reduce(function(query, sectionKey) {
        // TODO: implement
    }, '');

    if (sectiondef.length) {
        compound.sections = sectiondef;
    }



    console.dir(JSON.stringify(compounddef.$('briefdescription')));
    var briefdescription = compounddef.$('briefdescription').text();
    if (briefdescription) {
        compound.briefdescription = briefdescription;
    }



    //console.log(compounddef)
    //console.dir(JSON.stringify(compounddef));


    /*
    console.dir(JSON.stringify(compounddef.$('detaileddescription')));
    console.dir(JSON.stringify(compounddef.$('inheritancegraph')));
    console.dir(JSON.stringify(compounddef.$('collaborationgraph')));
    console.dir(JSON.stringify(compounddef.$('programlisting')));
    console.dir(JSON.stringify(compounddef.$('location')));
    console.dir(JSON.stringify(compounddef.$('listofallmembers')));*/

    return compound;
}

module.exports = {
    parse: parse
};
