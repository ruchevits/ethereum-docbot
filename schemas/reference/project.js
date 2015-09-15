'use strict';

var mongoose = require('mongoose');

var DocsReferenceProject = new mongoose.Schema({
    _version: String,
    slug: String,
    summary: mongoose.Schema.Types.Mixed
}, {
    collection: 'DocsReferenceProjects'
});

module.exports = mongoose.model('DocsReferenceProject', DocsReferenceProject);
