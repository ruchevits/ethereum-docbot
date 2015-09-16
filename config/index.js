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
    config.projects = JSON.parse(process.env.projects);
} catch (e) {
    config.projects = {};
}

try {
    config.wikis = JSON.parse(process.env.wikis);
} catch (e) {
    config.wikis = {};
}

module.exports = config;
