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

            logger.info('Doxygen finished working');

        });

    });

}

function compounddefType(compounddef){

    var compound = {
        slug: compounddef.attrs.id,
        parser: 'doxygen',
        body: {}
    };

    // Prot
    compound.body.prot = compounddef.attrs.prot;

    // Kind
    compound.body.kind = compounddef.attrs.kind;

    // Compound name (1)
    compound.body.name = compounddef.$('compoundname').text();

    // Title (0:1)
    if (compounddef.$('title').children.length){
        compound.body.title = compounddef.$('title').text();
    }

    // Base compound ref (0:N)
    if (compounddef.$('basecompoundref').children.length){
        compound.body.basecompoundref = compoundRefType(compounddef.$('basecompoundref'));
    }

    // Derived compound ref (0:N)
    if (compounddef.$('derivedcompoundref').children.length){
        compound.body.derivedcompoundref = compoundRefType(compounddef.$('derivedcompoundref'));
    }

    // Includes (0:N)
    if (compounddef.$('includes').children.length){
        compound.body.includes = incType(compounddef.$('includes'));
    }

    // Included by (0:N)
    if (compounddef.$('includedby').children.length){
        compound.body.includedby = incType(compounddef.$('includedby'));
    }

    // Incdepgraph (0:1)
    if (compounddef.$('incdepgraph').children.length){
        compound.body.incdepgraph = graphType(compounddef.$('incdepgraph').children[0]);
    }

    // Invincdepgraph (0:1)
    if (compounddef.$('invincdepgraph').children.length){
        compound.body.invincdepgraph = graphType(compounddef.$('invincdepgraph').children[0]);
    }

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

    // Template param list (0:1)
    if (compounddef.$('templateparamlist').children.length){
        compound.body.templateparamlist = templateparamlistType(compounddef.$('templateparamlist').children[0]);
    }

    // Sections (0:N)
    if (compounddef.$('sectiondef').length){
        compound.body.sections = [];
        compounddef.$('sectiondef').forEach(function(sectiondef){
            compound.body.sections.push(sectiondefType(sectiondef));
        });
    }

    // Brief description (0:1)
    if (compounddef.$('briefdescription').length){
        compound.body.briefdescription = descriptionType(compounddef.$('briefdescription').children[0]);
    }

    // Detailed description (0:1)
    if (compounddef.$('detaileddescription').length){
        compound.body.detaileddescription = descriptionType(compounddef.$('detaileddescription').children[0]);
    }

    // Inheritance graph (0:1)
    if (compounddef.$('inheritancegraph').children.length){
        compound.body.inheritancegraph = graphType(compounddef.$('inheritancegraph').children[0]);
    }

    // Collaboration graph (0:1)
    if (compounddef.$('collaborationgraph').children.length){
        compound.body.collaborationgraph = graphType(compounddef.$('collaborationgraph').children[0]);
    }

    // Program listing (0:1)
    if (compounddef.$('programlisting').children.length){
        compound.body.programlisting = listingType(compounddef.$('programlisting').children[0]);
    }

    // Location (0:1)
    if (compounddef.$('location').children.length){
        compound.body.location = locationType(compounddef.$('location').children[0]);
    }

    // List of all members (0:1)
    if (compounddef.$('listofallmembers').children.length){
        compound.body.listofallmembers = listofallmembersType(compounddef.$('listofallmembers').children[0]);
    }

    return compound;

}

function sectiondefType(sectiondef){

    var section = {
        kind: sectiondef.attrs.kind,
        body: {}
    };

    // Header (0:1)
    if (sectiondef.$('header').children.length){
        section.body.header = sectiondef.$('header').children[0];
    }

    // Description (0:1)
    if (sectiondef.$('description').length){
        section.body.description = descriptionType(sectiondef.$('description').children[0]);
    }

    // Member definitions (N)
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
    if (memberdef.$('templateparamlist').children.length){
        member.body.templateparamlist = templateparamlistType(memberdef.$('templateparamlist').children[0]);
    }

    // Type (0:1)
    if (memberdef.$('type').children.length){
        member.body.type = linkedTextType(memberdef.$('type').children[0]);
    }

    // TODO: Definition (0:1)
    /*if (memberdef.$('definition').children.length){
        member.body.definition = memberdef.$('definition').children[0];
    }*/

    // TODO: Args string (0:1)
    /*if (memberdef.$('argsstring').children.length){
        member.body.argsstring = memberdef.$('argsstring').children[0];
    }*/

    // Name (1)
    member.body.name = memberdef.$('name').text();

    // TODO: Read (0:1)
    /*if (memberdef.$('read').children.length){
        member.body.read = memberdef.$('read').children[0];
    }*/

    // TODO: Write (0:1)
    /*if (memberdef.$('write').children.length){
        member.body.write = memberdef.$('write').children[0];
    }*/

    // TODO: Bit field (0:1)
    /*if (memberdef.$('bitfield').children.length){
        member.body.bitfield = memberdef.$('bitfield').children[0];
    }*/

    // Reimplements (0:N)
    if (memberdef.$('reimplements').children.length){
        member.body.reimplements = reimplementType(memberdef.$('reimplements'));
    }

    // Reimplemented by (0:N)
    if (memberdef.$('reimplementedby').children.length){
        member.body.reimplementedby = reimplementType(memberdef.$('reimplementedby'));
    }

    // Parameters (0:N)
    if (memberdef.$('param').children.length){
        member.body.param = paramType(memberdef.$('param'));
    }

    // Enum value (0:N)
    if (memberdef.$('enumvalue').children.length){
        member.body.enumvalue = enumvalueType(memberdef.$('enumvalue'));
    }

    // Initializer (0:1)
    if (memberdef.$('initializer').children.length){
        member.body.initializer = linkedTextType(memberdef.$('initializer').children[0]);
    }

    // Exceptions (0:1)
    if (memberdef.$('exceptions').children.length){
        member.body.exceptions = linkedTextType(memberdef.$('exceptions').children[0]);
    }

    // Brief description (0:1)
    if (memberdef.$('briefdescription').length){
        member.body.briefdescription = descriptionType(memberdef.$('briefdescription').children[0]);
    }

    // Detailed description (0:1)
    if (memberdef.$('detaileddescription').length){
        member.body.detaileddescription = descriptionType(memberdef.$('detaileddescription').children[0]);
    }

    // In-body description (0:1)
    if (memberdef.$('inbodydescription').length){
        member.body.inbodydescription = descriptionType(memberdef.$('inbodydescription').children[0]);
    }

    // Location (1)
    member.body.location = locationType(memberdef.$('location').children[0]);

    // References (0:N)
    if (memberdef.$('references').children.length){
        member.body.references = referenceType(memberdef.$('references'));
    }

    // Referenced by (0:N)
    if (memberdef.$('referencedby').children.length){
        member.body.referencedby = referenceType(memberdef.$('referencedby'));
    }

    console.log(memberdef)
    console.log("================================================================================")

    return member;

}



// TODO: referenceType
function referenceType(element){
    return 0;
}

// TODO: listofallmembersType
function listofallmembersType(element){
    return 0;
}

// TODO: locationType
function locationType(element){
    return 0;
}

// TODO: graphType
function graphType(element){
    return 0;
}

// TODO: incType
function incType(element){
    return 0;
}

// TODO: compoundRefType
function compoundRefType(element){
    return 0;
}

// TODO: reimplementType
function reimplementType(element){
    return 0;
}

// TODO: paramType
function paramType(element){
    return 0;
}

// TODO: enumvalueType
function enumvalueType(element){
    return 0;
}

// TODO: linkedTextType
function linkedTextType(element){
    return 0;
}

// TODO: templateparamlistType
function templateparamlistType(element){
    return 0;
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

function descriptionType(element){

    var description = {};

    // Title (0:1)
    if (element.$('title').children.length){
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














// TODO: docCharType
function docCharType(element){
    return 0;
}

// TODO: docCaptionType
function docCaptionType(element){
    return 0;
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

        case 'ref':
            return docRefTextType(element);

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

function docRefTextType(element){

    var ref = {
        name: element.name,
        slug: element.attrs.refid,
        type: element.attrs.kindref,
        external: element.attrs.external,
        body: []
    };

    element.children.forEach(function(child){

        if (!child.name) {
            ref.body.push(child);
        } else {
            ref.body.push(docTitleCmdGroup(child));
        }

    });

    return ref;

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
    if (element.$('title').children.length){
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

module.exports = {
    parse: parse
};
