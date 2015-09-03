/**
 * @fileOverview EthDoc compound model definition.
 * @author <a href="http://ruchevits.com/">Edward Ruchevits</a>
 * @version 1.0.0
 */

'use strict';

var mongoose = require('mongoose');

/**
 * Javascript compound definition.
 *
 * @typedef JsCompoundBody
 * @type {object}
 * @property {string} kind -
 * @property {string} scope -
 * @property {string} name -
 * @property {string} [description] -
 * @property {string} [type] -
 * @property {string[]} [params] -
 * @property {string[]} [returns] -
 * @property {string[]} [examples] -
 * @property {string[]} [properties] -
 */
var JsCompoundBody;

/**
 * C++ compound definition.
 *
 * @typedef CppCompoundBody
 * @type {object}
 */
var CppCompoundBody;

/**
 * Markdown compound definition.
 *
 * @typedef MdCompoundBody
 * @type {object}
 */
var MdCompoundBody;

/**
 * Compound model.
 *
 * @constructor
 *
 * @param {string} _version - Version slug.
 * @param {string} _project - Project slug.
 * @param {string} slug - Unique compound slug.
 * @param {string} language - Compound language (i.e. js, cpp, md).
 * @param {JsCompoundBody|CppCompoundBody|MdCompoundBody} body - Compound definition.
 */
var DocCompound = new mongoose.Schema({
    _version: String,
    _project: String,
    parser: String,
    language: String,
    slug: String,
    kind: String,
    body: mongoose.Schema.Types.Mixed
}, {
    collection: 'DocCompounds'
});

module.exports = mongoose.model('DocCompound', DocCompound);
