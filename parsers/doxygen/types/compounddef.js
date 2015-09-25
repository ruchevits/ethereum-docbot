var _ = require('lodash');

var types = require('./index');
var sectiondefType = require('./sectiondef');

function compounddefType(compounddef){

    var compound = {
        slug: compounddef.attrs.id,
        parser: 'doxygen',
        kind: compounddef.attrs.kind,
        prot: compounddef.attrs.prot,
        summary: {},
        body: {}
    };

    // Title (0:1)
    if (compounddef.$('title').children.length){
        compound.body.name = compounddef.$('title').text();
    } else {
        // Compound name (1)
        compound.body.name = compound.summary.name = compounddef.$('compoundname').text();
    }

    /*
     // Includes (0:N)
     if (compounddef.$('includes').children.length){
     compound.body.includes = types.inc(compounddef.$('includes'));
     }

     // Included by (0:N)
     if (compounddef.$('includedby').children.length){
     compound.body.includedby = types.inc(compounddef.$('includedby'));
     }

     var innerRefs = {
     directories: compounddef.$('innerdir'), // Inner directories (0:N)
     files: compounddef.$('innerfile'), // Inner files (0:N)
     classes: compounddef.$('innerclass'), // Inner classes (0:N)
     namespaces: compounddef.$('innernamespace'), // Inner namespaces (0:N)
     pages: compounddef.$('innerpage'), // Inner pages (0:N)
     groups: compounddef.$('innergroup') // Inner groups (0:N)
     };

     _.each(innerRefs, function(innerRefValue, innerRefKey){

     // Initialize object for inner references if not exists
     compound.body.inner = compound.body.inner || {};

     innerRefValue.forEach(function(innerRef){
     compound.body.inner[innerRefKey] = compound.body.inner[innerRefKey] || [];
     compound.body.inner[innerRefKey].push(types.ref(innerRef));
     });

     });

     // List of all members (0:1)
     if (compounddef.$('listofallmembers').children.length){
     compound.body.listofallmembers = types.listofallmembers(compounddef.$('listofallmembers').children[0]);
     }

     var compoundRefs = {
     base: compounddef.$('basecompoundref'), // Base compound ref (0:N)
     derived: compounddef.$('derivedcompoundref') // Derived compound ref (0:N)
     };

     _.each(compoundRefs, function(compoundRefValue, compoundRefKey){

     // Initialize object for compound references if not exists
     compound.body.references = compound.body.references || {};

     compoundRefValue.forEach(function(compoundRef){
     compound.body.references[compoundRefKey] = compound.body.references[compoundRefKey] || [];
     compound.body.references[compoundRefKey].push(types.compoundRef(compoundRef));
     });

     });

     // Sections (0:N)
     compounddef.$('sectiondef').forEach(function(sectiondef){
     compound.body.sections = compound.body.sections || [];
     compound.body.sections.push(sectiondefType(sectiondef));
     });

     // Location (0:1)
     if (compounddef.$('location').children.length){
     compound.body.location = types.location(compounddef.$('location').children[0]);
     }

     // Template param list (0:1)
     if (compounddef.$('templateparamlist').children.length){
     compound.body.templateparams = types.templateparamlist(compounddef.$('templateparamlist').children[0]);
     }

     // Program listing (0:1)
     if (compounddef.$('programlisting').children.length){
     console.log('compounddef > programlisting');
     //compound.body.programlisting = types.listing(compounddef.$('programlisting').children[0]);
     }

     */





    // TODO: Brief description (0:1)
    /*if (compounddef.$('briefdescription').length){
        compound.summary.description = types.description(compounddef.$('briefdescription').children[0]);
    }

    // TODO: Detailed description (0:1)
    if (compounddef.$('detaileddescription').length){
        compound.body.description = types.description(compounddef.$('detaileddescription').children[0]);
    }*/





    // TODO: Incdepgraph (0:1)
    /*if (compounddef.$('incdepgraph').children.length){
        compound.body.incdepgraph = types.graph(compounddef.$('incdepgraph').children[0]);
    }*/

    // TODO: Invincdepgraph (0:1)
    /*if (compounddef.$('invincdepgraph').children.length){
        compound.body.invincdepgraph = types.graph(compounddef.$('invincdepgraph').children[0]);
    }*/

    // TODO: Inheritance graph (0:1)
    /*if (compounddef.$('inheritancegraph').children.length){
        compound.body.inheritancegraph = types.graph(compounddef.$('inheritancegraph').children[0]);
    }*/

    // TODO: Collaboration graph (0:1)
    /*if (compounddef.$('collaborationgraph').children.length){
        compound.body.collaborationgraph = types.graph(compounddef.$('collaborationgraph').children[0]);
    }*/

    return compound;

}

module.exports = compounddefType;
