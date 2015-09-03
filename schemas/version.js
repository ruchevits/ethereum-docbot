/**
 * @fileOverview EthDoc version model definition.
 * @author <a href="http://ruchevits.com/">Edward Ruchevits</a>
 * @version 1.0.0
 */

'use strict';

var mongoose = require('mongoose');

/**
 * Version model.
 *
 * @constructor
 *
 * @param {string} slug - Unique version slug.
 * @param {string} createdAt - Datetime of creation.
 */
var DocVersion = new mongoose.Schema({
    slug: String,
    createdAt: String
}, {
    collection: 'DocVersions'
});

module.exports = mongoose.model('DocVersion', DocVersion);
