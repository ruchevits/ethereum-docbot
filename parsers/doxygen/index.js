var Q = require('q');
var fs = require('fs-extra');
var glob = require("glob");
var path = require('path');
var xamel = require('xamel');
var spawn = require('child_process').spawn;

var config = require('../../config');
var logger = require('../../logger');

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
                compounds.push(compounddefType(compounddef));
            });

            resolve(compounds);

        }).catch(function(err){

            reject(err);

        }).done(function(){

            // TODO: log

        });

    });

}

function compounddefType(compounddef){

    var compound = {
        slug: compounddef.attrs.id,
        kind: compounddef.attrs.kind,
        prot: compounddef.attrs.prot,
        parser: 'doxygen',
        body: {}
    };

    // Compound name (1)
    compound.body.compoundname = compounddef.$('compoundname').text();

    // Title (0:1)
    if (compounddef.$('title')){
        compound.body.title = compounddef.$('title').text();
    }

    // TODO: basecompoundref (0:N)
    // compoundRefType
    //compound.body.basecompoundref = 0;

    // TODO: derivedcompoundref (0:N)
    // compoundRefType
    //compound.body.derivedcompoundref = 0;

    // TODO: includes (0:N)
    // incType
    //compound.body.includes = 0;

    // TODO: includedby (0:N)
    // incType
    //compound.body.includedby = 0;

    // TODO: incdepgraph (0:1)
    // graphType
    //compound.body.incdepgraph = 0;

    // TODO: invincdepgraph (0:1)
    // graphType
    //compound.body.invincdepgraph = 0;

    // Inner directories (0:N)
    if (compounddef.$('innerdir').length){
        compound.body.innerdir = [];
        compounddef.$('innerdir').forEach(function(innerdir){
            compound.body.innerdir.push(refType(innerdir));
        });
    }

    // Inner files (0:N)
    if (compounddef.$('innerfile').length){
        compound.body.innerfile = [];
        compounddef.$('innerfile').forEach(function(innerfile){
            compound.body.innerfile.push(refType(innerfile));
        });
    }

    // Inner classes (0:N)
    if (compounddef.$('innerclass').length){
        compound.body.innerclass = [];
        compounddef.$('innerclass').forEach(function(innerclass){
            compound.body.innerclass.push(refType(innerclass));
        });
    }

    // Inner namespaces (0:N)
    if (compounddef.$('innernamespace').length){
        compound.body.innernamespace = [];
        compounddef.$('innernamespace').forEach(function(innernamespace){
            compound.body.innernamespace.push(refType(innernamespace));
        });
    }

    // Inner pages (0:N)
    if (compounddef.$('innerpage').length){
        compound.body.innerpage = [];
        compounddef.$('innerpage').forEach(function(innerpage){
            compound.body.innerpage.push(refType(innerpage));
        });
    }

    // Inner groups (0:N)
    if (compounddef.$('innergroup').length){
        compound.body.innergroup = [];
        compounddef.$('innergroup').forEach(function(innergroup){
            compound.body.innergroup.push(refType(innergroup));
        });
    }

    // TODO: Template param list (0:1)
    // templateparamlistType
    //compound.body.templateparamlist = 0;

    // Sections (0:N)
    /*if (compounddef.$('sectiondef').length){
     compound.body.sections = [];
     compounddef.$('sectiondef').forEach(function(sectiondef){
     compound.body.sections.push(sectiondefType(sectiondef));
     });
     }*/

    // Brief description (0:1)
    /*if (compounddef.$('briefdescription').length){
        compound.body.briefdescription = descriptionType(compounddef.$('briefdescription').children[0]);
    }*/

    // Detailed description (0:1)
    if (compounddef.$('detaileddescription').length){
        compound.body.detaileddescription = descriptionType(compounddef.$('detaileddescription').children[0]);
    }

    // TODO: inheritancegraph (0:1)
    // graphType
    //compound.body.inheritancegraph = 0;

    // TODO: collaborationgraph (0:1)
    // graphType
    //compound.body.collaborationgraph = 0;

    // TODO: Program listing (0:1)
    // compound.body.programlisting = listingType(compounddef.$('programlisting').children[0]);

    // TODO: Location (0:1)
    // locationType
    // compound.body.location = 0;

    // listofallmembers (0:1)
    // TODO: listofallmembersType
    //compound.body.listofallmembers = 0;

    //console.log('============================================');

    return compound;

}

function sectiondefType(sectiondef){

    var section = {
        kind: sectiondef.attrs.kind,
        body: {}
    };

    // Header (0:1)
    section.body.header = 0;

    // Description (0:1)
    section.body.description = 0;

    // Member def (N)
    section.body.members = [];
    sectiondef.$('memberdef').forEach(function(memberdef){
        section.body.members.push(memberdefType(memberdef));
    });

    return section;

}

function memberdefType(memberdef){

    var member = {
        kind: memberdef.attrs.kind,
        id: memberdef.attrs.id,
        prot: memberdef.attrs.prot,
        static: memberdef.attrs.static,
        const: memberdef.attrs.const,
        explicit: memberdef.attrs.explicit,
        inline: memberdef.attrs.inline,
        virt: memberdef.attrs.virt,
        volatile: memberdef.attrs.volatile,
        mutable: memberdef.attrs.mutable,
        readable: memberdef.attrs.readable,
        writable: memberdef.attrs.writable,
        initonly: memberdef.attrs.initonly,
        settable: memberdef.attrs.settable,
        gettable: memberdef.attrs.gettable,
        final: memberdef.attrs.final,
        sealed: memberdef.attrs.sealed,
        new: memberdef.attrs.new,
        add: memberdef.attrs.add,
        remove: memberdef.attrs.remove,
        raise: memberdef.attrs.raise,
        optional: memberdef.attrs.optional,
        required: memberdef.attrs.required,
        accessor: memberdef.attrs.accessor,
        body: {}
    };

    // Template param list (0:1)
    member.body.templateparamlist = 0;

    // Type (0:1)
    member.body.type = 0;

    // Definition (0:1)
    member.body.definition = 0;

    // Args string (0:1)
    member.body.argsstring = 0;

    // Name (1)
    member.body.name = 0;

    // Read (0:1)
    member.body.read = 0;

    // Write (0:1)
    member.body.write = 0;

    // Bit field (0:1)
    member.body.bitfield = 0;

    // Reimplements (0:N)
    member.body.reimplements = 0;

    // Reimplemented by (0:N)
    member.body.reimplementedby = 0;

    // Param (0:N)
    member.body.param = 0;

    // Enum value (0:N)
    member.body.enumvalue = 0;

    // Initializer (0:1)
    member.body.initializer = 0;

    // Exceptions (0:1)
    member.body.exceptions = 0;

    // Brief description (0:1)
    member.body.briefdescription = 0;

    // Detailed description (0:1)
    member.body.detaileddescription = 0;

    // In-body description (0:1)
    member.body.inbodydescription = 0;

    // Location (1)
    member.body.location = 0;

    // References (0:N)
    member.body.references = 0;

    // Referenced by (0:N)
    member.body.referencedby = 0;

    return member;

}

function docURLLink(element){

    var link = {
        name: element.name,
        url: element.attrs.url,
        body: []
    };

    element.children.forEach(function(child){

        if (!child.name) {
            link.body.push(child);
        } else {
            link.body.push(docTitleCmdGroup(child));
        }

    });

    return link;

}

function docMarkupType(element){

    var markup = {
        name: element.name,
        body: []
    };

    element.children.forEach(function(child){

        if (!child.name) {
            markup.body.push(child);
        } else {
            markup.body.push(docCmdGroup(child));
        }

    });

    return markup;

}

function docEmptyType(element){

    return {
        name: element.name
    };

}

// TODO: docCharType
function docCharType(element){
    return 0;
}

function docHeadingType(element){

    var heading = {
        name: element.name,
        level: element.attrs.level,
        body: []
    };

    element.children.forEach(function(child){

        if (!child.name) {
            heading.body.push(child);
        } else {
            heading.body.push(docTitleCmdGroup(child));
        }

    });

    return heading;

}

function docListType(element){

    var list = {
        name: element.name,
        items: []
    };

    element.children.forEach(function(child){

        if (child.name == 'listitem') {
            list.items.push(docListItemType(child));
        }

    });

    return list;

}

function docListItemType(element){

    var listitem = {
        name: element.name,
        paragraphs: docParaType(element.children[0])
    };

    return listitem;

}

function docTableType(element){

    var table = {
        name: element.name,
        size: {
            rows: element.attrs.rows,
            cols: element.attrs.cols
        },
        rows: []
    };

    // Rows (0:N)
    if (element.$('row').children.length){
        table.rows = [];
        element.$('row').children.forEach(function(row){
            table.rows.push(docRowType(row));
        });
    }

    // Caption (0:1)
    if (element.$('caption').children.length){
        table.body.caption = docCaptionType(element.$('caption').children[0]);
    }

    return table;

}

function docRowType(element){

    var row = {
        name: element.name,
        entries: []
    };

    // Entries (0:N)
    if (element.$('entry').children.length){
        element.$('entry').children.forEach(function(entry){
            row.entries.push(docEntryType(entry));
        });
    }

    return row;

}

function docEntryType(element){

    var entry = {
        name: element.name,
        thead: element.attrs.thead,
        paragraphs: []
    };

    // Paragraphs (0:N)
    if (element.$('para').children.length){
        element.$('para').children.forEach(function(paragraph){
            entry.paragraphs.push(docParaType(paragraph));
        });
    }

    return entry;

}

// TODO: docCaptionType
function docCaptionType(element){
    return 0;
}

function docTitleCmdGroup(element){

    switch (element.name) {

        case 'ulink':
            return docURLLink(element);

        case 'bold':
        case 'emphasis':
        case 'computeroutput':
        case 'subscript':
        case 'superscript':
        case 'center':
        case 'small':
            return docMarkupType(element);

        // TODO: htmlonly
        // xsd:string
        //case 'htmlonly':
        //    console.log(element)
        //    return 0;

        // TODO: latexonly
        // xsd:string
        //case 'latexonly':
        //    console.log(element)
        //    return 0;

        // TODO: dot
        // xsd:string
        //case 'dot':
        //    console.log(element)
        //    return 0;

        // TODO: anchor
        // docAnchorType
        //case 'anchor':
        //    console.log(element)
        //    return 0;

        // TODO: formula
        // docFormulaType
        //case 'formula':
        //    console.log(element)
        //    return 0;

        // TODO: ref
        // docRefTextType
        //case 'ref':
        //    console.log(element)
        //    return 0;

        case 'copy':
        case 'trademark':
        case 'registered':
        case 'lsquo':
        case 'rsquo':
        case 'ldquo':
        case 'rdquo':
        case 'ndash':
        case 'mdash':
        case 'nonbreakablespace':
            return docEmptyType(element);

        case 'umlaut':
        case 'acute':
        case 'grave':
        case 'circ':
        case 'slash':
        case 'tilde':
        case 'cedil':
        case 'ring':
        case 'szlig':
            return docCharType(element);

        default:
            logger.error('Not implemented: ' + element.name);

    }

}

function docCmdGroup(element){

    switch (element.name){

        case 'linebreak':
        case 'hruler':
            return docEmptyType(element);

        case 'preformatted':
            return docMarkupType(element);

        case 'programlisting':
            return listingType(element);

        // xsd:string
        //case 'verbatim':
        //    return 0;

        // docIndexEntryType
        //case 'indexentry':
        //    return 0;

        case 'orderedlist':
        case 'itemizedlist':
            return docListType(element);

        // docSimpleSectType
        //case 'simplesect':
        //    return 0;

        // docTitleType
        //case 'title':
        //    return 0;

        // docVariableListType
        //case 'variablelist':
        //    return 0;

        case 'table':
            return docTableType(element);

        case 'heading':
            return docHeadingType(element);

        // docImageType
        //case 'image':
        //    return 0;

        // docDotFileType
        //case 'dotfile':
        //    return 0;

        // docTocListType
        //case 'toclist':
        //    return 0;

        // docLanguageType
        //case 'language':
        //    return 0;

        // docParamListType
        //case 'parameterlist':
        //    return 0;

        // docXRefSectType
        //case 'xrefsect':
        //    return 0;

        // docCopyType
        //case 'copydoc':
        //    return 0;

        default:
            return docTitleCmdGroup(element);

    }

}

// TODO: listingType
function listingType(element){
    return 0;
}

function refType(element){

    return {
        slug: element.attrs.refid,
        prot: element.attrs.prot,
        name: element.text()
    };

}

function docParaType(element){

    var paragraph = [];

    element.children.forEach(function(child){

        if (!child.name) {
            paragraph.push(child);
        } else if (child.name == 'para') {
            paragraph.push(docParaType(child));
        } else {
            paragraph.push(docCmdGroup(child));
        }

    });

    return paragraph;

}

function docSect1Type(element){

    var sect1 = {
        id: element.attrs.id,
        body: {}
    };

    // Title (1)
    if (element.$('title')){
        sect1.title = element.$('title').text();
    }

    // Paragraphs (0:N)
    if (element.$('para').children.length){
        sect1.paragraphs = [];
        element.$('para').children.forEach(function(paragraph){
            sect1.paragraphs.push(docParaType(paragraph));
        });
    }

    // Type 2 sections (0:N)
    if (element.$('sect2').children.length){
        sect1.sections = [];
        element.$('sect2').children.forEach(function(section){
            sect1.sections.push(docSect2Type(section));
        });
    }

    // Internal (0:1)
    if (element.$('internal').children.length){
        sect1.internal = docInternalS1Type(element.$('internal').children[0]);
    }

    return sect1;

}

// TODO: docSect2Type
function docSect2Type(element){
    return 0;
}

// TODO: docInternalS1Type
function docInternalS1Type(element){
    return 0;
}

// TODO: docInternalType
function docInternalType(element){

    var internal = {};

    // Paragraphs (0:N)
    if (element.$('para').children.length){
        internal.paragraphs = [];
        element.$('para').children.forEach(function(paragraph){
            internal.paragraphs.push(docParaType(paragraph));
        });
    }

    // Type 1 sections (0:N)
    if (element.$('sect1').length){
        internal.sections = [];
        element.$('sect1').forEach(function(section){
            internal.sections.push(docSect1Type(section));
        })
    }

    return internal;

}

function descriptionType(element){

    var description = {};

    // Title (0:1)
    if (element.$('title')){
        description.title = element.$('title').text();
    }

    // Para (0:N)
    if (element.$('para').length){
        description.paragraphs = [];
        if (element.$('para').children.length){
            element.$('para').children.forEach(function(paragraph){
                description.paragraphs.push(docParaType(paragraph));
            })
        }
    }

    // Type 1 sections (0:N)
    if (element.$('sect1').length){
        description.sections = [];
        element.$('sect1').forEach(function(section){
            description.sections.push(docSect1Type(section));
        })
    }

    // Internal (0:1)
    if (element.$('internal').length){
        description.internal = docInternalType(element.$('internal').children[0]);
    }

    return description;

}

module.exports = {
    parse: parse
};
