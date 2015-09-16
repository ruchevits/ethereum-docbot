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

var DocsReferenceVersion = require('../schemas/reference/version');
var DocsReferenceProject = require('../schemas/reference/project');
var DocsReferenceCompound = require('../schemas/reference/compound');
var DocsWikiBook = require('../schemas/wiki/book');
var DocsWikiPage = require('../schemas/wiki/page');

function createReference(version, project, compounds){

    return Q.Promise(function(resolve, reject, notify){

        return Q.fcall(function(){

            return createReferenceVersion(version);

        }).then(function(createdVersion){

            return createReferenceProject(createdVersion, project);

        }).then(function(createdProject){

            return createReferenceCompounds(createdProject, compounds);

        }).catch(function(err){

            reject(err);

        }).done(function(){

            resolve(true);

        });

    });

}

function createReferenceVersion(version){
    return Q.Promise(function(resolve, reject, notify) {
        DocsReferenceVersion.find({
            slug: version.slug
        }, function(err, foundVersion){
            if (err) {
                reject(err);
            }
            if (foundVersion.length){
                resolve(version);
            } else {
                DocsReferenceVersion.create(version, function(err, newVersion){
                    if (err) {
                        reject(err);
                    }
                    logger.info("Created new reference version: " + version.slug);
                    resolve(newVersion);
                });
            }
        });
    });
}

function createReferenceProject(version, project){
    return Q.Promise(function(resolve, reject, notify) {
        DocsReferenceProject.remove({
            _version: version.slug,
            slug: project.slug
        }, function (err) {
            if (err) {
                reject(err);
            }
            project._version = version.slug;
            DocsReferenceProject.create(project, function (err, newProject) {
                if (err) {
                    reject(err);
                }
                logger.info("Updated project: " + project.slug);
                resolve(newProject);
            });
        });
    });
}

function createReferenceCompounds(project, compounds){
    return Q.Promise(function(resolve, reject, notify) {
        DocsReferenceCompound.remove({
            _version: project._version,
            _project: project.slug
        }, function(err){
            if (err) {
                reject(err);
            }
            _.forEach(compounds, function(compound) {
                compound._version = project._version;
                compound._project = project.slug;
                DocsReferenceCompound.create(compound, function(err){
                    if (err) {
                        reject(err);
                    }
                });
            });
            logger.info("Updated compounds in project: " + project.slug);
            resolve(true);
        });
    });
}

function createWiki(book, pages){

    return Q.Promise(function(resolve, reject, notify){

        return Q.fcall(function(){

            return createWikiBook(book);

        }).then(function(createdBook){

            return createWikiPages(createdBook, pages);

        }).catch(function(err){

            reject(err);

        }).done(function(){

            resolve(true);

        });

    });

}

function createWikiBook(book){
    return Q.Promise(function(resolve, reject, notify) {
        DocsWikiBook.remove({
            slug: book.slug
        }, function (err) {
            if (err) {
                reject(err);
            }
            DocsWikiBook.create(book, function (err, newBook) {
                if (err) {
                    reject(err);
                }
                logger.info("Updated book: " + book.slug);
                resolve(newBook);
            });
        });
    });
}

function createWikiPages(book, pages){
    return Q.Promise(function(resolve, reject, notify) {
        DocsWikiPage.remove({
            _book: book.slug
        }, function(err){
            if (err) {
                reject(err);
            }
            _.forEach(pages, function(page) {
                page._book = book.slug;
                DocsWikiPage.create(page, function(err){
                    if (err) {
                        reject(err);
                    }
                });
            });
            logger.info("Updated pages in book: " + book.slug);
            resolve(true);
        });
    });
}

module.exports = {
    createReference: createReference,
    createWiki: createWiki
};
