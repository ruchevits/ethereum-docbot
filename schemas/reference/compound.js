'use strict';

var mongoose = require('mongoose');

var DocsReferenceCompound = new mongoose.Schema({
    _version: String,
    _project: String,
    slug: String,
    parser: String,
    kind: String,
    summary: mongoose.Schema.Types.Mixed,
    body: mongoose.Schema.Types.Mixed
}, {
    collection: 'DocsReferenceCompounds'
});

module.exports = mongoose.model('DocsReferenceCompound', DocsReferenceCompound);
