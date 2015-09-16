'use strict';

var fs = require('fs-extra');
var express = require('express');
var crypto = require('crypto');

var config = require('../config');
var logger = require('../logger');
var events = require('../events');

var router = express.Router();

router.post('/', function(req, res) {

    var body = res.socket.parser.incoming.body;

    var secret;

    // Check if the repository name is valid
    if (config.projects[body.repository.name]) {
        secret = config.projects[body.repository.name];
    } else if (config.wikis[body.repository.name]) {
        secret = config.wikis[body.repository.name];
    } else {
        logger.error('Not currently watching for changes in ' + body.repository.name + ' repository');
        return res.end();
    }

    // Validate request
    var hmac = crypto.createHmac("sha1", secret);
    hmac.update(JSON.stringify(body));
    var signature = 'sha1=' + hmac.digest("hex");

    // Restrict the request
    if (signature !== req.headers['x-hub-signature']) {
        logger.error('Wrong x-hub-signature specified for ' + body.repository.name + ' repository');
        return res.end();
    }

    var destination = {};

    // Check which branch involved
    if (body.ref) {
        if (body.ref.substring(0, 10) == "refs/tags/") {

            // Pushed to a tag
            destination.type = "tag";
            destination.name = body.ref.substring(10);

        } else if (body.ref.substring(0, 11) == "refs/heads/") {

            // Pushed to a branch
            destination.type = "branch";
            destination.name = body.ref.substring(11);

        }
    }

    var payload = {
        slug: body.repository.name,
        destination: destination,
        repository: body.repository
    };

    // TODO: implement queue

    // Check which GitHub event happened
    switch (req.headers['x-github-event']) {

        // TODO: remove
        case 'watch':

        // Triggered when a repository branch is pushed to
        case 'push':
            events.push(payload);
            break;

        // Unexpected event
        default:
            logger.error(req.headers['x-github-event'] + ' event handling not implemented');
            break;
    }

    return res.end();

});

/*router.get('/', function(req, res) {

    var DocsReferenceVersion = require('../schemas/reference/version');
    var DocsReferenceProject = require('../schemas/reference/project');
    var DocsReferenceCompound = require('../schemas/reference/compound');
    var DocsWikiBook = require('../schemas/wiki/book');
    var DocsWikiPage = require('../schemas/wiki/page');

    var response = {
        versions: null,
        projects: null,
        compounds: null
    };

    DocsReferenceVersion.find({}, function(err, versions){
        if(err) return res.status(500).send(err);
        response.versions = versions;

        DocsReferenceProject.find({}, function(err, projects){
            if(err) return res.status(500).send(err);
            response.projects = projects;

            DocsReferenceCompound.find({}, function(err, compounds){
                if(err) return res.status(500).send(err);
                response.compounds = compounds;

                DocsWikiBook.find({}, function(err, books){
                    if(err) return res.status(500).send(err);
                    response.books = books;

                    DocsWikiPage.find({}, function(err, pages){
                        if(err) return res.status(500).send(err);
                        response.pages = pages;

                        return res.status(200).json(response);
                    });
                });
            });
        });
    });

});*/

module.exports = router;
