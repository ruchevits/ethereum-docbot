var _ = require('lodash');

var types = require('./index');

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

    // Name (1)
    member.body.name = memberdef.$('name').text();

    // Definition (0:1)
    if (memberdef.$('definition').children.length){
        member.body.definition = memberdef.$('definition').children[0].text();
    }

    // Args string (0:1)
    if (memberdef.$('argsstring').children.length){
        member.body.argsstring = memberdef.$('argsstring').children[0].text();
    }

    // TODO: Read (0:1)
    if (memberdef.$('read').children.length){
        console.log('memberdef > read');
        //member.body.read = memberdef.$('read').children[0].text();
    }

    // TODO: Write (0:1)
    if (memberdef.$('write').children.length){
        console.log('memberdef > write');
        //member.body.write = memberdef.$('write').children[0].text();
    }

    // TODO: Bit field (0:1)
    if (memberdef.$('bitfield').children.length){
        console.log('memberdef > bitfield');
        //member.body.bitfield = memberdef.$('bitfield').children[0].text();
    }

    // TODO: References (0:N)
    memberdef.$('references').forEach(function(reference){
        console.log('memberdef > references');
        //member.body.references = member.body.references || [];
        //member.body.references.push(types.reference(reference));
    });

    // TODO: Referenced by (0:N)
    memberdef.$('referencedby').forEach(function(reference){
        console.log('memberdef > referencedby');
        //member.body.referencedby = member.body.referencedby || [];
        //member.body.referencedby.push(types.reference(reference));
    });

    // Reimplements (0:N)
    memberdef.$('reimplements').forEach(function(reimplement){
        member.body.reimplements = member.body.reimplements || [];
        member.body.reimplements.push(types.reimplement(reimplement));
    });

    // Reimplemented by (0:N)
    memberdef.$('reimplementedby').forEach(function(reimplement){
        member.body.reimplementedby = member.body.reimplementedby || [];
        member.body.reimplementedby.push(types.reimplement(reimplement));
    });

    // Enum value (0:N)
    memberdef.$('enumvalue').forEach(function(enumvalue){
        member.body.enumvalues = member.body.enumvalues || [];
        member.body.enumvalues.push(types.enumvalue(enumvalue));
    });

    // Parameters (0:N)
    memberdef.$('param').forEach(function(param){
        member.body.params = member.body.params || [];
        member.body.params.push(types.param(param));
    });

    // Type (0:1)
    if (memberdef.$('type').children.length){
        member.body.type = types.linkedText(memberdef.$('type').children[0]);
    }

    // Initializer (0:1)
    if (memberdef.$('initializer').children.length){
        member.body.initializer = types.linkedText(memberdef.$('initializer').children[0]);
    }

    // Exceptions (0:1)
    if (memberdef.$('exceptions').children.length){
        member.body.exceptions = types.linkedText(memberdef.$('exceptions').children[0]);
    }

    // Location (1)
    member.body.location = types.location(memberdef.$('location').children[0]);

    // Template param list (0:1)
    if (memberdef.$('templateparamlist').children.length){
        member.body.templateparamlist = types.templateparamlist(memberdef.$('templateparamlist').children[0]);
    }

    // Brief description (0:1)
    if (memberdef.$('briefdescription').length){
        member.body.briefdescription = types.description(memberdef.$('briefdescription').children[0]);
    }

    // Detailed description (0:1)
    if (memberdef.$('detaileddescription').length){
        member.body.detaileddescription = types.description(memberdef.$('detaileddescription').children[0]);
    }

    // In-body description (0:1)
    if (memberdef.$('inbodydescription').length){
        member.body.inbodydescription = types.description(memberdef.$('inbodydescription').children[0]);
    }

    return member;

}

module.exports = memberdefType;
