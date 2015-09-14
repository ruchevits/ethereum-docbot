'use strict';

var path = require('path');

// TODO: read from environment variables
var config = {
    env: 'development',
    port: 3001,
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
    config.projects = require('./projects.json');
} catch (e) {
    config.projects = {};
}

try {
  config.wikis = process.env.wikis;
} catch (e) {
    config.wikis = {};
}

module.exports = config;
