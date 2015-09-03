/**
 * @fileOverview EthDoc wiki model definition.
 * @author <a href="http://ruchevits.com/">Edward Ruchevits</a>
 * @version 1.0.0
 */

'use strict';

var mongoose = require('mongoose');

/**
 * Wiki model.
 *
 * @constructor
 */
var DocWiki = new mongoose.Schema({
    slug: String,
    createdAt: String
}, {
    collection: 'DocWikis'
});

module.exports = mongoose.model('DocWiki', DocWiki);
