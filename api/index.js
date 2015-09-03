'use strict';

var fs = require('fs-extra');
var path = require('path');
var express = require('express');
var crypto = require('crypto');

var config = require('../config');
var logger = require('../logger');
var events = require('../events');

var router = express.Router();

router.post('/', function(req, res) {

    var body = res.socket.parser.incoming.body;

    // Check if the repository name is valid
    if (!config.projects[body.repository.name]) {
        logger.error('Not currently watching for changes in ' + body.repository.name + ' repository');
        return res.end();
    }

    // Validate request
    var hmac = crypto.createHmac("sha1", config.projects[body.repository.name]);
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

router.get('/', function(req, res) {

    var DocCompound = require('../schemas/compound.js');
    var DocProject = require('../schemas/project.js');
    var DocVersion = require('../schemas/version.js');
    var DocWiki = require('../schemas/wiki.js');
    var DocWikiPage = require('../schemas/wikiPage.js');

    var response = {
        versions: null,
        projects: null,
        compounds: null
    };

    DocVersion.find({}, function(err, versions){
        if(err) return res.status(500).send(err);
        response.versions = versions;

        DocProject.find({}, function(err, projects){
            if(err) return res.status(500).send(err);
            response.projects = projects;

            DocCompound.find({}, function(err, compounds){
                if(err) return res.status(500).send(err);
                response.compounds = compounds;

                return res.status(200).json(response);
            });
        });
    });

});

module.exports = router;
