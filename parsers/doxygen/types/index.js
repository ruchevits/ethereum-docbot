var _ = require('lodash');
var marked = require('marked');

var logger = require('../../../logger');

function incType(element){

    var includes = [];

    element.children.forEach(function(child){

        includes.push({
            name: child.text(),
            refid: child.attrs.refid,
            isLocal: child.attrs.local
        });

    });

    return includes;

}

function listofallmembersType(element){

    var members = [];

    element.children.forEach(function(child){

        var member = {
            refid: child.attrs.refid,
            prot: child.attrs.prot,
            virt: child.attrs.virt,
            ambiguityscope: child.attrs.ambiguityscope
        };

        if (child.$('scope').length){
            member.scope = child.$('scope').children[0].text();
        }

        if (child.$('name').length){
            member.name = child.$('name').children[0].text();
        }

        members.push(member);

    });

    return members;

}

function compoundRefType(element){

    return {
        name: element.children[0],
        refid: element.attrs.refid,
        prot: element.attrs.prot,
        virt: element.attrs.virt
    };

}

function reimplementType(element){

    return {
        name: element.children[0],
        refid: element.attrs.refid
    };

}

function locationType(element){

    return {
        file: element.attrs.file,
        line: element.attrs.line,
        bodyfile: element.attrs.bodyfile,
        bodystart: element.attrs.bodystart,
        bodyend: element.attrs.bodyend,
    };

}

function templateparamlistType(element){

    var params = [];

    element.$('param').forEach(function(child){

        params.push(paramType(child));

    });

    return params;

}

function paramType(element){

    var param = {};

    // Type (0:1)
    if (element.$('type').length){
        param.types = linkedTextType(element.$('type').children[0]);
    }

    // Declaration name (0:1)
    if (element.$('declname').length){
        param.declname = element.$('declname').children[0].text();
    }

    // Default name (0:1)
    if (element.$('defname').length){
        param.defname = element.$('defname').children[0].text();
    }

    // Array (0:1)
    if (element.$('array').length){
        param.array = element.$('array').children[0].text();
    }

    // Default value (0:1)
    if (element.$('defval').length){
        param.defvals = linkedTextType(element.$('defval').children[0]);
    }

    // Brief description (0:1)
    if (element.$('briefdescription').length){
        param.detaileddescription = descriptionType(element.$('briefdescription').children[0]);
    }

    return param;

}

function enumvalueType(element){

    var enumvalue = {
        id: element.attrs.id,
        prot: element.attrs.prot
    };

    // Name (1)
    enumvalue.name = element.$('name').text();

    // Initializer (0:1)
    if (element.$('initializer').length){
        enumvalue.initializer = linkedTextType(element.$('initializer').children[0]);
    }

    // Brief description (0:1)
    if (element.$('briefdescription').length){
        enumvalue.briefdescription = descriptionType(element.$('briefdescription').children[0]);
    }

    // Detailed description (0:1)
    if (element.$('detaileddescription').length){
        enumvalue.detaileddescription = descriptionType(element.$('detaileddescription').children[0]);
    }

    return enumvalue;

}

function linkedTextType(element){

    var linkedTextRefs = [];

    element.children.forEach(function(child){

        linkedTextRefs.push(refTextType(child));

    });

    return linkedTextRefs;

}

function refTextType(element){

    var refText = {};

    if (typeof element === 'string' || element instanceof String) {

        refText = {
            name: element
        };

    } else if (element.name == 'ref') {

        refText = {
            name: element.children[0],
            refid: element.attrs.refid,
            kindref: element.attrs.kindref,
            external: element.attrs.external,
            tooltip: element.attrs.tooltip
        }

    } else {

        console.log('refTextType > else')

    }

    return refText;

}

function listingType(element){

    var codelines = [];

    element.children.forEach(function(child){

        codelines.push(codelineType(child));

    });

    return codelines;

}

function codelineType(element){

    console.log(element)

    return 0;

}

// TODO: graphType
function graphType(element){
    return 0;
}

// TODO: nodeType
function nodeType(element){
    return 0;
}

// TODO: childnodeType
function childnodeType(element){
    return 0;
}







// TODO: referenceType
function referenceType(element){
    //console.log(element)
    return 0;
}

// TODO: descriptionType
function descriptionType(element){

    var description = {};

    /*
     // Title (0:1)
     if (element.$('title').length){
     //description.title = element.$('title').text();
     console.log("descriptionType title!!!")
     }

     // Para (0:N)
     element.$('para').forEach(function(paragraph){
     description.html = description.html || '';
     description.html += docParaType(paragraph);
     //description.paragraphs = description.paragraphs || [];
     //description.paragraphs.push(docParaType(paragraph));
     });

     // Type 1 sections (0:N)
     element.$('sect1').forEach(function(paragraph){
     //description.sections = description.sections || [];
     //description.sections.push(docSect1Type(paragraph));
     console.log("descriptionType sect1!!!")
     });

     // Internal (0:1)
     if (element.$('internal').length){
     //description.internal = docInternalType(element.$('internal').children[0]);
     console.log("descriptionType internal!!!")
     }
     */

    return description;

}

// TODO: refType
function refType(element){

    /*return {
        slug: element.attrs.refid,
        prot: element.attrs.prot,
        name: element.text()
    };*/

    return 0;

}

// TODO: memberRefType
function memberRefType(element){
    return 0;
}

// TODO: highlightType
function highlightType(element){
    return 0;
}

// TODO: linkType
function linkType(element){
    return 0;
}

////////////////////////////////////////////////////////////////////////////////

function docCmdGroup(element){

    switch (element.name){

        case 'linebreak':
        case 'hruler':
            return docEmptyType(element);

        case 'preformatted':
            return docMarkupType(element);

        case 'programlisting':
            return listingType(element);

        case 'verbatim':
            return element;

        case 'indexentry':
            return docIndexEntryType(element);

        case 'orderedlist':
        case 'itemizedlist':
            return docListType(element);

        case 'simplesect':
            return docSimpleSectType(element);

        case 'title':
            return docTitleType(element);

        case 'variablelist':
            return docVariableListType(element);

        case 'table':
            return docTableType(element);

        case 'heading':
            return docHeadingType(element);

        case 'image':
            return docImageType(element);

        case 'dotfile':
            return docDotFileType(element);

        case 'toclist':
            return docTocListType(element);

        case 'language':
            return docLanguageType(element);

        case 'parameterlist':
            return docParamListType(element);

        case 'xrefsect':
            return docXRefSectType(element);

        case 'copydoc':
            return docCopyType(element);

        default:
            return docTitleCmdGroup(element);

    }

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

        case 'htmlonly':
        case 'latexonly':
        case 'dot':
            return element;

        case 'anchor':
            return docAnchorType(element);

        case 'formula':
            return docFormulaType(element);

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
            logger.warning('Not implemented: ' + element.name);

    }

}

function docURLLink(element){

    var link = '';

    element.children.forEach(function(child){

        if (!child.name) {
            link += '['+child+']('+element.attrs.url+')';
            //link.body.push(child);
        } else {
            //link.body.push(docTitleCmdGroup(child));
            console.log('docURLLink !!!')
        }

    });

    return link;

}

function docMarkupType(element){

    var markup = '';

    element.children.forEach(function(child){

        if (!child.name) {
            console.log('docMarkupType');
            console.log(child);
            markup += child;
        } else {
            console.log('docMarkupType !!!');
            //markup.body.push(docCmdGroup(child));
        }

    });

    return markup;

}

function docAnchorType(element){
    return 0;
}

function docFormulaType(element){
    return 0;
}

function docRefTextType(element){

    return {
        type: 'link',
        text: '<a href="'+element.attrs.refid+'">REF_TEXT</a>'
    };

    /*return {
     type: 'text',
     text: '<a href="'+element.attrs.refid+'">REF_TEXT</a>'
     };*/

    /*console.log(element)

     var ref = {
     type: element.name,
     refid: element.attrs.refid,
     kindref: element.attrs.kindref,
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

     return ref;*/

}

function docCharType(element){
    return element.attrs.char;
}

function docEmptyType(element){
    console.log('docEmptyType');
    //console.log(element)
    //return '['+element.attrs.name+']';
}

function docTitleType(element){
    console.log('docTitleType');
    return 0;
}

function docIndexEntryType(element){
    console.log('docIndexEntryType');
    return 0;
}

function docSimpleSectType(element){

    var kind = element.attrs.kind;

    var section = '<section class="' + kind + '">';

    element.children.forEach(function(child){

        switch (child.name) {

            case 'para':
                section += docParaType(child);
                break;

            case 'simplesectsep':
                section += ' ';
                break;

        }

    });

    section += '</section>';

    return section;

}

function docVarListEntryType(element){
    console.log('docVarListEntryType');
    return 0;
}

function docVariableListGroup(element){
    console.log('docVariableListGroup');
    return 0;
}

function docVariableListType(element){
    console.log('docVariableListType');
    return 0;
}

function docImageType(element){
    console.log('docImageType');
    return 0;
}

function docDotFileType(element){
    console.log('docDotFileType');
    return 0;
}

function docTocItemType(element){
    console.log('docTocItemType');
    return 0;
}

function docTocListType(element){
    console.log('docTocListType');
    return 0;
}

function docLanguageType(element){
    console.log('docLanguageType');
    return 0;
}

function docParamListType(element){
    console.log('docParamListType');
    return 0;
}

function docParamListItem(element){
    console.log('docParamListItem');
    return 0;
}

function docParamNameList(element){
    console.log('docParamNameList');
    return 0;
}

function docParamName(element){
    console.log('docParamName');
    return 0;
}

function docXRefSectType(element){
    console.log('docXRefSectType');
    return 0;
}

function docCopyType(element){
    console.log('docCopyType');
    return 0;
}

function docCaptionType(element){
    console.log('docCaptionType');
    return 0;
}

function docHeadingType(element){

    var heading = {
        type: element.name,
        depth: element.attrs.level,
        text: []
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

    /*var list = {
     type: element.name,
     items: []
     };*/

    // List items (1:N)
    /*element.$('listitem').children.forEach(function(child){
     list.items.push(docListItemType(child));
     });*/

    /*element.children.forEach(function(child){
     if (child.name == 'listitem') {
     list.items.push(docListItemType(child));
     }
     });*/

    return 0;

}

function docListItemType(element){

    var listitem = {
        type: element.name,
        paragraphs: []
    };

    // Paragraphs (1:N)
    element.$('para').children.forEach(function(paragraph){
        listitem.paragraphs.push(docParaType(paragraph));
    });

    return listitem;

}

function docTableType(element){

    var table = {
        type: element.name,
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
        type: element.name,
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
        type: element.name,
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

function docParaType(element){

    var paragraph = {
        type: 'text',
        text: ''
    };

    element.children.forEach(function(child){

        if (!child.name) {
            paragraph.text += child + ' ';
        } else if (child.name == 'para') {
            /*paragraph.push(
                docParaType(child)
            );*/
            console.log('docParaType !!!');
        } else {
            paragraph.text += docCmdGroup(child) + ' ';
        }

    });

    var tokens = [paragraph];
    tokens.links = {};

    return marked.parser(tokens);

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

function docSect2Type(element){

    var sect2 = {
        id: element.attrs.id,
        body: {}
    };

    // Title (1)
    if (element.$('title').children.length){
        sect2.title = element.$('title').text();
    }

    // Paragraphs (0:N)
    if (element.$('para').children.length){
        sect2.paragraphs = [];
        element.$('para').children.forEach(function(paragraph){
            sect2.paragraphs.push(docParaType(paragraph));
        });
    }

    // Type 3 sections (0:N)
    if (element.$('sect3').children.length){
        sect2.sections = [];
        element.$('sect3').children.forEach(function(section){
            sect2.sections.push(docSect3Type(section));
        });
    }

    // Internal (0:1)
    if (element.$('internal').children.length){
        sect2.internal = docInternalS2Type(element.$('internal').children[0]);
    }

    return sect2;

}

function docSect3Type(element){

    var sect3 = {
        id: element.attrs.id,
        body: {}
    };

    // Title (1)
    if (element.$('title').children.length){
        sect3.title = element.$('title').text();
    }

    // Paragraphs (0:N)
    if (element.$('para').children.length){
        sect3.paragraphs = [];
        element.$('para').children.forEach(function(paragraph){
            sect3.paragraphs.push(docParaType(paragraph));
        });
    }

    // Type 4 sections (0:N)
    if (element.$('sect4').children.length){
        sect3.sections = [];
        element.$('sect4').children.forEach(function(section){
            sect3.sections.push(docSect4Type(section));
        });
    }

    // Internal (0:1)
    if (element.$('internal').children.length){
        sect3.internal = docInternalS3Type(element.$('internal').children[0]);
    }

    return sect3;

}

function docSect4Type(element){

    var sect4 = {
        id: element.attrs.id,
        body: {}
    };

    // Title (1)
    if (element.$('title').children.length){
        sect4.title = element.$('title').text();
    }

    // Paragraphs (0:N)
    if (element.$('para').children.length){
        sect4.paragraphs = [];
        element.$('para').children.forEach(function(paragraph){
            sect4.paragraphs.push(docParaType(paragraph));
        });
    }

    // Internal (0:1)
    if (element.$('internal').children.length){
        sect4.internal = docInternalS4Type(element.$('internal').children[0]);
    }

    return sect4;

}

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

function docInternalS1Type(element){

    var internalS1 = {};

    // Paragraphs (0:N)
    if (element.$('para').children.length){
        internalS1.paragraphs = [];
        element.$('para').children.forEach(function(paragraph){
            internalS1.paragraphs.push(docParaType(paragraph));
        });
    }

    // Type 2 sections (0:N)
    if (element.$('sect2').length){
        internalS1.sections = [];
        element.$('sect2').forEach(function(section){
            internalS1.sections.push(docSect2Type(section));
        })
    }

    return internalS1;

}

function docInternalS2Type(element){

    var internalS2 = {};

    // Paragraphs (0:N)
    if (element.$('para').children.length){
        internalS2.paragraphs = [];
        element.$('para').children.forEach(function(paragraph){
            internalS2.paragraphs.push(docParaType(paragraph));
        });
    }

    // Type 3 sections (0:N)
    if (element.$('sect3').length){
        internalS2.sections = [];
        element.$('sect3').forEach(function(section){
            internalS2.sections.push(docSect3Type(section));
        })
    }

    return internalS2;

}

function docInternalS3Type(element){

    var internalS3 = {};

    // Paragraphs (0:N)
    if (element.$('para').children.length){
        internalS3.paragraphs = [];
        element.$('para').children.forEach(function(paragraph){
            internalS3.paragraphs.push(docParaType(paragraph));
        });
    }

    // Type 4 sections (0:N)
    if (element.$('sect3').length){
        internalS3.sections = [];
        element.$('sect3').forEach(function(section){
            internalS3.sections.push(docSect4Type(section));
        })
    }

    return internalS3;

}

function docInternalS4Type(element){

    var internalS4 = {};

    // Paragraphs (0:N)
    if (element.$('para').children.length){
        internalS4.paragraphs = [];
        element.$('para').children.forEach(function(paragraph){
            internalS4.paragraphs.push(docParaType(paragraph));
        });
    }

    return internalS4;

}

module.exports = {
    listofallmembers: listofallmembersType,
    memberRef: memberRefType,
    compoundRef: compoundRefType,
    reimplement: reimplementType,
    inc: incType,
    enumvalue: enumvalueType,
    templateparamlist: templateparamlistType,
    param: paramType,
    graph: graphType,
    node: nodeType,
    childnode: childnodeType,
    codeline: codelineType,
    highlight: highlightType,
    reference: referenceType,
    location: locationType,
    link: linkType,
    linkedText: linkedTextType,
    ref: refType,
    description: descriptionType,
    listing: listingType,
    ////////////////////////////////////////
    URLLink: docURLLink,
    MarkupType: docMarkupType,
    AnchorType: docAnchorType,
    FormulaType: docFormulaType,
    RefTextType: docRefTextType,
    CharType: docCharType,
    EmptyType: docEmptyType,
    TitleType: docTitleType,
    IndexEntryType: docIndexEntryType,
    SimpleSectType: docSimpleSectType,
    VarListEntryType: docVarListEntryType,
    VariableListGroup: docVariableListGroup,
    VariableListType: docVariableListType,
    ImageType: docImageType,
    DotFileType: docDotFileType,
    TocItemType: docTocItemType,
    TocListType: docTocListType,
    LanguageType: docLanguageType,
    ParamListType: docParamListType,
    ParamListItem: docParamListItem,
    ParamNameList: docParamNameList,
    ParamName: docParamName,
    XRefSectType: docXRefSectType,
    CopyType: docCopyType,
    CaptionType: docCaptionType,
    HeadingType: docHeadingType,
    ListType: docListType,
    ListItemType: docListItemType,
    TableType: docTableType,
    RowType: docRowType,
    EntryType: docEntryType,
    ParaType: docParaType,
    Sect1Type: docSect1Type,
    Sect2Type: docSect2Type,
    Sect3Type: docSect3Type,
    Sect4Type: docSect4Type,
    InternalType: docInternalType,
    InternalS1Type: docInternalS1Type,
    InternalS2Type: docInternalS2Type,
    InternalS3Type: docInternalS3Type,
    InternalS4Type: docInternalS4Type,
    CmdGroup: docCmdGroup,
    TitleCmdGroup: docTitleCmdGroup
};
