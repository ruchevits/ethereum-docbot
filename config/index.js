'use strict';

var path = require('path');

var logger = require('../logger');

var config = {
    env: 'development',
    port: process.env.port,
    root: path.normalize(__dirname + '../..'),
    temp: '.tmp',
    mongo: {
        uri: process.env.mongoUrl,
        options: {
            db: {
                safe: true
            }
        }
    }
};

try {
    logger.info('loading projects:', process.env.projects);
    config.projects = process.env.projects;
} catch (e) {
    config.projects = {};
}

try {
    logger.info('loading wikis:', process.env.wikis);
    config.wikis = process.env.wikis;
} catch (e) {
    config.wikis = {};
}

module.exports = config;
