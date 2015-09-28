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

function codelineType(element){

    console.log(element)

    return 0;

}

function descriptionType(element){

    var description = {};

    // Title (0:1)
    if (element.$('title').length){
        console.log("descriptionType > title")
        //description.title = element.$('title').text();
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
        console.log("descriptionType > sect1");
        //description.sections = description.sections || [];
        //description.sections.push(docSect1Type(paragraph));
    });

    // Internal (0:1)
    if (element.$('internal').length){
        console.log("descriptionType > internal");
        //description.internal = docInternalType(element.$('internal').children[0]);
    }

    return description;

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

        case 'variablelist':
            return docVariableListType(element);

        case 'orderedlist':
        case 'itemizedlist':
            return docListType(element);

        case 'simplesect':
            return docSimpleSectType(element);

        case 'xrefsect':
            return docXRefSectType(element);

        case 'parameterlist':
            return docParamListType(element);

        case 'programlisting':
            // TODO: programlisting
            return '';
            //return listingType(element);



        case 'linebreak':
        case 'hruler':
            //return docEmptyType(element);

        case 'preformatted':
            //return docMarkupType(element);

        case 'verbatim':
            //return element;

        case 'indexentry':
            //return docIndexEntryType(element);

        case 'title':
            //return docTitleType(element);

        case 'table':
            //return docTableType(element);

        case 'heading':
            //return docHeadingType(element);

        case 'image':
            //return docImageType(element);

        case 'dotfile':
            //return docDotFileType(element);

        case 'toclist':
            //return docTocListType(element);

        case 'language':
            //return docLanguageType(element);

        case 'copydoc':
            //return docCopyType(element);

        default:
            return docTitleCmdGroup(element);

    }

}

function docTitleCmdGroup(element){

    switch (element.name) {

        case 'ref':
            return docRefTextType(element);

        case 'ulink':
            return docURLLink(element);

        case 'anchor':
            return docAnchorType(element);

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
            //return element;

        case 'formula':
            //return docFormulaType(element);

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
            //return docEmptyType(element);

        case 'umlaut':
        case 'acute':
        case 'grave':
        case 'circ':
        case 'slash':
        case 'tilde':
        case 'cedil':
        case 'ring':
        case 'szlig':
            //return docCharType(element);

        default:
            logger.warning('Not implemented: ' + element.name);
            return '';

    }

}

function docParaType(element){

    var paragraph = {
        type: 'paragraph',
        text: ''
    };

    element.children.forEach(function(child){

        if (typeof child === 'string' || child instanceof String) {

            paragraph.text += child;

        } else {

            paragraph.text += docCmdGroup(child);

        }

    });

    var tokens = [paragraph];
    tokens.links = {};

    //console.log(marked.parser(tokens))

    return marked.parser(tokens);

}

function docRefTextType(element){

    // TODO: kindref, external
    //element.attrs.kindref
    //element.attrs.external

    var html = '';

    element.children.forEach(function(child){

        if (typeof child === 'string' || child instanceof String) {
            html += child;
        } else {
            html += docTitleCmdGroup(child);
        }

    });

    return '<a href="#" ng-click="ref(\'' + element.attrs.refid + '\')">' + html + '</a>';

    //return generateLink(html, localizeRefLink(element.attrs.refid));

}

function docURLLink(element){

    var html = '';

    element.children.forEach(function(child){

        if (typeof child === 'string' || child instanceof String) {
            html += child;
        } else {
            html += docTitleCmdGroup(child);
        }

    });

    return generateLink(html, element.attrs.url);

}

function docVariableListType(element){

    var html = '<ul>';

    element.children.forEach(function(child){

        html += docVariableListGroup(child);

    });

    html += '</ul>';

    return html;

}

function docVariableListGroup(element){

    var html = '';

    if (element.name == 'varlistentry') {

        html += docVarListEntryType(element);

    } else if (element.name == 'listitem') {

        html += docListItemType(element);

    } else {

        console.log('docVariableListGroup > else')

    }

    return html;

}

function docVarListEntryType(element){

    var html = '<li>';

    element.children.forEach(function(child){

        html += docTitleType(child);

    });

    html += '</li>';

    return html;

}

function docTitleType(element){

    var html = '';

    element.children.forEach(function(child){

        if (typeof child === 'string' || child instanceof String) {

            html += child;

        } else {

            html += docTitleCmdGroup(child);

        }

    });

    return html;

}

function docListItemType(element){

    var html = '<li>';

    element.$('para').forEach(function(child){

        html += docParaType(child);

    });

    html += '</li>';

    return html;

}

// TODO: review docAnchorType
function docAnchorType(element){

    return generateLink('ANCHOR', '#' + element.attrs.id);

}

function docListType(element){

    var html = '<ul>';

    element.children.forEach(function(child){

        html += docListItemType(child);

    });

    html += '</ul>';

    return html;

}

function docSimpleSectType(element){

    var html = '<section class="' + element.attrs.kind + '">';

    element.children.forEach(function(child){

        if (child.name == 'para') {

            html += docParaType(child);

        } else {

            console.log('docSimpleSectType > else');

        }

    });

    html += '</section>';

    return html;

    /*
    <xsd:element name="title" type="docTitleType" minOccurs="0" />
    <xsd:sequence minOccurs="0" maxOccurs="unbounded">
        <xsd:element name="para" type="docParaType" minOccurs="1" maxOccurs="unbounded" />
        <xsd:element name="simplesectsep" type="docEmptyType" minOccurs="0"/>
    </xsd:sequence>
    */

}

function docMarkupType(element){

    var html = '';

    switch (element.name) {

        case 'bold':
            html += '<b>';
            break;

        case 'emphasis':
            html += '<em>';
            break;

        case 'computeroutput':
            html += '<pre>';
            break;

        case 'subscript':
            html += '<sub>';
            break;

        case 'superscript':
            html += '<sup>';
            break;

        case 'center':
            html += '<center>';
            break;

        case 'small':
            html += '<small>';
            break;

    }

    element.children.forEach(function(child){

        if (typeof child === 'string' || child instanceof String) {

            html += child;

        } else {

            html += docCmdGroup(child);

        }

    });

    switch (element.name) {

        case 'bold':
            html += '</b>';
            break;

        case 'emphasis':
            html += '</em>';
            break;

        case 'computeroutput':
            html += '</pre>';
            break;

        case 'subscript':
            html += '</sub>';
            break;

        case 'superscript':
            html += '</sup>';
            break;

        case 'center':
            html += '</center>';
            break;

        case 'small':
            html += '</small>';
            break;

    }

    return html;

}

function docXRefSectType(element){

    //element.attrs.id

    var html = '';

    element.children.forEach(function(child){

        if (child.name == 'xreftitle') {

            html += child;

        } else if (child.name == 'xrefdescription') {

            var description = descriptionType(child);

            html += description.html;

        }

    });

    return html;

}

function docParamListType(element){

    //element.attrs.kind

    var html = '';

    element.children.forEach(function(child){

        html += docParamListItem(child);

    });

    console.log(html)

    return html;

}

function docParamListItem(element){

    var html = '';

    element.children.forEach(function(child){

        if (child.name == 'parameternamelist') {

            html += docParamNameList(child);

        } else if (child.name == 'parameterdescription') {

            var description = descriptionType(child);

            html += description.html;

        }

    });

    return html;

}

function docParamNameList(element){

    var html = '';

    element.children.forEach(function(child){

        html += docParamName(child);

    });

    return html;

}

function docParamName(element){

    //element.attrs.direction

    var html = '';


    element.children.forEach(function(child){

        var refText = refTextType(child);

        /*
        name: element.children[0],
        refid: element.attrs.refid,
        kindref: element.attrs.kindref,
        external: element.attrs.external,
        tooltip: element.attrs.tooltip
        */

        html += refText.name;

    });

    return html;

}




























function docFormulaType(element){
    return 0;
}

function docCharType(element){
    return element.attrs.char;
}

function docEmptyType(element){
    console.log('docEmptyType');
    //console.log(element)
    //return '['+element.attrs.name+']';
}

function docIndexEntryType(element){
    console.log('docIndexEntryType');
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

// TODO: localizeRefLink
function localizeRefLink(link){
    return link;
    //return '/TODO/' + link;
}

function generateLink(text, href){
    return '[' + text + '](' + href + ')';
}
