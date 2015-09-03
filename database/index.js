/**
 * @fileOverview
 * @author <a href="http://ruchevits.com/">Edward Ruchevits</a>
 * @version 1.0.0
 */

'use strict';

var Q = require('q');
var _ = require('lodash');

var logger = require('../logger');
var helpers = require('../helpers');

var DocCompound = require('../schemas/compound.js');
var DocProject = require('../schemas/project.js');
var DocVersion = require('../schemas/version.js');
var DocWiki = require('../schemas/wiki.js');
var DocWikiPage = require('../schemas/wikiPage.js');

function createVersion(version){

    return Q.Promise(function(resolve, reject, notify) {

        DocVersion.find({
            slug: version.slug
        }, function(err, foundVersion){

            if (err) {
                reject(err);
            }

            if (foundVersion.length){

                logger.info("Version '" + version.slug + "' already exists");

                resolve(version);

            } else {

                DocVersion.create({
                    slug: version.slug
                }, function(err){

                    if (err) {
                        reject(err);
                    }

                    logger.info("Created new version '" + version.slug + "'");

                    resolve(version);

                });

            }

        });

    });

}

function createProject(project, version){

    return Q.Promise(function(resolve, reject, notify) {

        DocProject.remove({
            _version: version.slug,
            slug: project.slug
        }, function (err) {

            if (err) {
                reject(err);
            }

            DocProject.create({
                _version: version.slug,
                slug: project.slug,
                repository: project.repository,
                summary: project.summary,
                created_at: Math.floor(Date.now() / 1000)
            }, function (err, newProject) {

                if (err) {
                    reject(err);
                }

                logger.info("Updated project '" + project.slug + "'");

                resolve(newProject);

            });

        });

    });

}

function createCompounds(compounds, project){

    return Q.Promise(function(resolve, reject, notify) {

        DocCompound.remove({
            _version: project._version,
            _project: project.slug
        }, function(err){

            if (err) {
                reject(err);
            }

            // For each compound
            _.forEach(compounds, function(compound) {

                DocCompound.create({
                    _version: project._version,
                    _project: project.slug,
                    slug: compound.slug,
                    parser: compound.parser,
                    body: compound.body
                }, function(err){

                    if (err) {
                        reject(err);
                    }

                });

            });

            logger.info("Updated compounds for project '" + project.slug + "'");

            resolve(true);

        });

    });

}

/**
 * Saves project and all its compounds to a database.
 *
 * @param {object} payload - Project information.
 */
function createProjectAndCompounds(project, compounds){

    var developVersion = {
        slug: 'develop'
    };

    return Q.Promise(function(resolve, reject, notify){

        return Q.fcall(function(){

            return createVersion(developVersion);

        }).then(function(version){

            return createProject(project, version);

        }).then(function(project){

            return createCompounds(compounds, project);

        }).catch(function(err){

            reject(err);

        }).done(function(){

            resolve(true);

        });

    });

}

module.exports = {
    createProjectAndCompounds: createProjectAndCompounds
};
