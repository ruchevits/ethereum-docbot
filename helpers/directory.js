var Q = require('q');
var fs = require('fs-extra');
var glob = require("glob");
var del = require('del');

function createTempDir(dirname) {

    return Q.Promise(function(resolve, reject, notify) {

        fs.ensureDir(dirname, function (err) {

            if (err) {
                reject(new Error(err));
            }

            resolve(dirname);

        });

    });

}

function cleanDir(path, pattern) {

    return Q.Promise(function(resolve, reject, notify) {

        var cwd = process.cwd();

        process.chdir(path);

        // Delete ignored files
        del(pattern, function (err, deletedFiles) {

            if (err) {
                reject(new Error(err));
            }

            process.chdir(cwd);

            resolve(deletedFiles.length);

        });

    });

}

module.exports = {
    create: {
        temp: createTempDir
    },
    clean: cleanDir
};