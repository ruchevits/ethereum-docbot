'use strict';

var path = require('path');

// TODO: read from environment variables
var config = {
    env: 'development',
    port: 3001,
    root: path.normalize(__dirname + '../..'),
    temp: '.tmp',
    mongo: {
        uri: 'mongodb://localhost:27017/ethdev',
        options: {
            db: {
                safe: true
            }
        }
    }
};

try {
    config.projects = require('./projects.json');
} catch (e) {
    config.projects = {};
}

try {
    config.wikis = require('./wikis.json');
} catch (e) {
    config.wikis = {};
}

module.exports = config;
