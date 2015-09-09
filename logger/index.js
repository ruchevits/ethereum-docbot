module.exports = {
    info: function(message){
        console.log("[INFO] " + message);
    },
    warning: function(message){
        console.log('[WARNING] ' + message);
    },
    error: function(message){
        console.log('[ERROR] ' + message);
    }
};
