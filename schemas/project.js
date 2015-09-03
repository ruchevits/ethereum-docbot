/**
 * @fileOverview EthDoc project model definition.
 * @author <a href="http://ruchevits.com/">Edward Ruchevits</a>
 * @version 1.0.0
 */

'use strict';

var mongoose = require('mongoose');

/**
 * Repository object.
 *
 * @typedef Repository
 * @type {object}
 *
 * @property {string} url - Repository clone URL.
 */
var Repository;

/**
 * Project summary object.
 *
 * @typedef ProjectSummary
 * @type {object}
 *
 * @property {string} name - Project name.
 * @property {string} description - Project description.
 */
var ProjectSummary;

/**
 * Project model.
 *
 * @constructor
 *
 * @param {string} _version - Version slug.
 * @param {string} slug - Unique project slug.
 * @param {Repository} repository - Information about the remote project repository.
 * @param {ProjectSummary} summary - Project summary.
 */
var DocProject = new mongoose.Schema({
    _version: String,
    slug: String,
    repository: {
        clone_url: String
    },
    summary: {
        name: String,
        description: String
    }
}, {
    collection: 'DocProjects'
});

module.exports = mongoose.model('DocProject', DocProject);
