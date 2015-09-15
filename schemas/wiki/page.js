'use strict';

var mongoose = require('mongoose');

var DocsWikiPage = new mongoose.Schema({
    _book: String,
    slug: String,
    parser: String,
    summary: mongoose.Schema.Types.Mixed,
    body: mongoose.Schema.Types.Mixed
}, {
    collection: 'DocsWikiPages'
});

module.exports = mongoose.model('DocsWikiPage', DocsWikiPage);
