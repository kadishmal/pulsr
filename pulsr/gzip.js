/*
 gzip.js
 A module which compressed data with zlib.gzip.
 */
define(['conf', 'zlib'], function(conf, zlib) {
    function compress(resourceType, request, data, callback) {
        if (// check if we want to gzip this resource
            conf.file.handlerOptions[resourceType].gzip
                // Gzipping files below 150 bytes can actually make them larger.
                && data.length > 150
                // Check if client accepts compressed data
                && request.headers['accept-encoding'] && request.headers['accept-encoding'].indexOf('gzip') > -1) {
            // output after gzip is smaller than after gzip with default configurations
            zlib.gzip(data, function(err, buffer) {
                if (!err) {
                    data = buffer;
                    callback(data);
                }
                else{
                    callback();
                }
            });
        }
        else{
            callback();
        }
    }

    return {
        compressJS: function (request, data, callback) {
            compress('.js', request, data, callback);
        },
        compressLESS: function (request, data, callback) {
            compress('.less', request, data, callback);
        }
    };
});