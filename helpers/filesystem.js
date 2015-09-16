var Q = require('q');
var fs = require('fs-extra');
var glob = require("glob");
var del = require('del');

function readConfig(repoDir) {
    return Q.Promise(function(resolve, reject, notify) {

        fs.readFile(repoDir + '/ethbot.json', 'utf8', function (err, data) {

            if (err) {
                reject(new Error(err));
            }

            resolve(JSON.parse(data));

        });

    });
}

module.exports = {
    read: {
        config: readConfig
    }
};
