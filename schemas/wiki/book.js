'use strict';

var mongoose = require('mongoose');

var DocsWikiBook = new mongoose.Schema({
    slug: String,
    summary: mongoose.Schema.Types.Mixed,
    repository: mongoose.Schema.Types.Mixed
}, {
    collection: 'DocsWikiBooks'
});

module.exports = mongoose.model('DocsWikiBook', DocsWikiBook);
