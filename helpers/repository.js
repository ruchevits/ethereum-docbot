var Q = require('q');
var git = require('nodegit');

function cloneRepository(origin, destination) {

    var opts = {
        remoteCallbacks: {
            certificateCheck: function() {
                return 1;
            }
        }
    };

    return Q.Promise(function(resolve, reject, notify) {

        git.Clone.clone(origin, destination, opts).then(function(repository) {
            resolve(destination);
        }).catch(function(err){
            reject(new Error(err));
        });

    });

}

module.exports = {
    clone: cloneRepository
};
