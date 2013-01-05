// A file handler to serve image files requested by a client.
// This module does not validate the request.url. The parent fileHandler.js
// module should pass this module only image type file requests.
define(['conf', 'fs', 'error_handler', 'moment', 'fileCache'], function (conf, fs, error_handler, moment, fileCache) {
    return function (request, response, options) {
        var fileName = request.url.substring(request.url.lastIndexOf('/') + 1, request.url.lastIndexOf('.')),
            // remove the front / slash for relative path
            sourceFile = request.url.substring(1);

        fileCache.stats.get(sourceFile, function (err, stat) {
            if (err) {
                console.log(sourceFile + ' could not be found.');
                error_handler.handle(request, response, err);
            }
            else{
                var etag = stat.ino + '-' + stat.size + '-' + Date.parse(stat.mtime);

                if (options.cache) {
                    response.setHeader('Cache-Control', 'public, max-age=' + conf.app.cache.maxage);
                    response.setHeader('Expires', moment(stat.mtime).add('months', 3).utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ'));
                }

                if (request.headers['if-none-match'] === etag) {
                    // 304 = Not modified
                    response.statusCode = 304;
                    response.end();
                }
                else {
                    response.setHeader('Content-Type', options.contentType);
                    response.setHeader('ETag', etag);
                    response.statusCode = 200;

                    fs.createReadStream(sourceFile).pipe(response);
                }
            }
        });
    };
});