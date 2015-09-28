var _ = require('lodash');

var types = require('./index');
var memberdefType = require('./memberdef');

function sectiondefType(sectiondef){

    var section = {
        kind: sectiondef.attrs.kind,
        body: {
            members: []
        }
    };

    /*

    // TODO: Header (0:1)
    if (sectiondef.$('header').children.length){
        console.log('sectiondefType > header');
        //console.log(sectiondef.$('header'))
        //console.log(sectiondef.$('header').children[0])
        //section.body.header = sectiondef.$('header').children[0];
    }

     // Member definitions (N)
     sectiondef.$('memberdef').forEach(function(memberdef){
     section.body.members.push(memberdefType(memberdef));
     });

    */

    // Description (0:1)
    if (sectiondef.$('description').length){
        section.body.description = types.description(sectiondef.$('description').children[0]);
    }

    return section;

}

module.exports = sectiondefType;
