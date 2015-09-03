'use strict';

var fs = require('fs-extra');
var path = require('path');
var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');

var config = require('./config');
var logger = require('./logger');
var api = require('./api');

// Connect to the database
mongoose.connect(config.mongo.uri, config.mongo.options);

var app = express();

// Setup server
var server = http.createServer(app);

app.use(bodyParser.json());
app.use(errorHandler());

app.use('/', api);

// Start server
server.listen(config.port, config.ip, function () {
    logger.info('Express server listening on ' + config.port + ' in ' + app.get('env') + ' mode\n');
});

// Expose application
module.exports = app;
