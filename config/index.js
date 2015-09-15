'use strict';

var path = require('path');

// TODO: read from environment variables
var config = {
    env: 'development',
    port: 3000,
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
  console.log("loading projects:", process.env.projects);
  config.projects = process.env.projects;
} catch (e) {
    config.projects = {};
}

try {
  console.log("loading wikis:", process.env.wikis);
  config.wikis = process.env.wikis;
} catch (e) {
    config.wikis = {};
}

module.exports = config;
