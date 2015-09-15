'use strict';

var mongoose = require('mongoose');

var DocsReferenceVersion = new mongoose.Schema({
    slug: String
}, {
    collection: 'DocsReferenceVersions'
});

module.exports = mongoose.model('DocsReferenceVersion', DocsReferenceVersion);
