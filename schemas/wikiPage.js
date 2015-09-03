/**
 * @fileOverview EthDoc wiki page model definition.
 * @author <a href="http://ruchevits.com/">Edward Ruchevits</a>
 * @version 1.0.0
 */

'use strict';

var mongoose = require('mongoose');

/**
 * Wiki page model.
 *
 * @constructor
 */
var DocWikiPage = new mongoose.Schema({
    _wiki: String,
    language: String,
    slug: String,
    html: mongoose.Schema.Types.Mixed
}, {
    collection: 'DocWikiPages'
});

module.exports = mongoose.model('DocWikiPage', DocWikiPage);
