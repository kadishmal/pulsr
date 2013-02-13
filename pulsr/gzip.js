// A module to compress the data with zlib.gzip.
define(['conf', 'zlib'], function(conf, zlib) {
    function compress(mimeType, request, data, callback) {
        if (
            // Check if we want to gzip this resource.
            conf.get('file.handlerOptions')[mimeType].gzip
            // Gzipping files below 150 bytes can actually make them larger, so send them uncompressed.
            && data.length > 150
            // Check if the client accepts compressed data.
            && request.headers['accept-encoding'] && request.headers['accept-encoding'].indexOf('gzip') > -1) {
            zlib.gzip(data, function(err, buffer) {
                if (!err) {
                    callback(buffer);
                }
                else{
                    // If an error occurred, simply call the callback with no arguments.
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
            compress(conf.get('file.allowedMimes.js'), request, data, callback);
        },
        compressLESS: function (request, data, callback) {
            compress(conf.get('file.allowedMimes.css'), request, data, callback);
        }
    };
});