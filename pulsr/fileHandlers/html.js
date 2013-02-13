// A file handler that gzips HTML files requested by a client.
// This module does not validate the request.url. The parent fileHandler.js
// module should pass this module only *.html* file requests.
define(['path', 'conf', 'fs', 'error_handler', 'zlib', 'mkdirp', 'moment', 'fileCache'], function (path, conf, fs, error_handler, zlib, mkdirp, moment, fileCache) {
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
                var etag = stat.ino + '-' + stat.size + '-' + Date.parse(stat.mtime),
                    targetDir = path.join(conf.get('path.htmlCompiled'), fileName),
                    targetFileName = etag + '.html',
                    targetFilePath = path.join(targetDir, targetFileName);

                if (options.cache) {
                    response.setHeader('Cache-Control', 'public, max-age=' + conf.get('app.cache.maxage'));
                    // we can't directly pass stat.mtime to moment() because moment() directly
                    // modifies the given object, though it shouldn't. Reported this issue to
                    // https://github.com/timrwood/moment/issues/592
                    response.setHeader('Expires', moment(stat.mtime.getTime()).add('months', 3).utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ'));
                    // Server must send Vary header if any data is cacheable.
                    // Refer to http://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html#sec13.6
                    //          http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.44
                    response.setHeader('Vary', 'accept-encoding');
                }

                if (request.headers['if-none-match'] === etag) {
                    // 304 = Not modified
                    response.statusCode = 304;
                    response.end();
                }
                else {
                    response.setHeader('Content-Type', 'text/html');
                    response.setHeader('ETag', etag);
                    response.statusCode = 200;

                    function processFile() {
                        var sourceFileStream = fs.createReadStream(sourceFile);

                        if (
                            // Check if we want to gzip this resource.
                            conf.get('file.handlerOptions')[options.contentType].gzip
                            // Gzipping files below 150 bytes can actually make them larger, so send them uncompressed.
                            && stat.size > 150
                            // Check if the client accepts compressed data.
                            && request.headers['accept-encoding'] && request.headers['accept-encoding'].indexOf('gzip') > -1) {
                            var gzip = sourceFileStream.pipe(zlib.createGzip());

                            targetFileName += conf.get('file.extensions.gzip');
                            targetFilePath += conf.get('file.extensions.gzip');

                            response.setHeader('Content-Encoding', 'gzip');
                            // Piping to a response object will automatically close the response
                            // when piping is done.
                            gzip.pipe(response);

                            // Now store the gzipped content into a file.
                            // First, make sure the target directory exists
                            fs.exists(targetDir, function (exists) {
                                if (exists) {
                                    // Remove old compiled files.
                                    fs.readdir(targetDir, function (err, files) {
                                        files.forEach(function(file) {
                                            if (file != targetFileName) {
                                                fs.unlink(path.join(targetDir, file), function (err) {
                                                    if (err) {
                                                        console.log('Could not delete ' + path.join(targetDir, file) + ' file.');
                                                    }
                                                });
                                            }
                                        });
                                    });

                                    gzip.pipe(fs.createWriteStream(targetFilePath));
                                }
                                else {
                                    mkdirp(targetDir, '0755', function(err) {
                                        if (err) {
                                            console.log('Could not create ' + targetDir + ' directory.');
                                        }
                                        else{
                                            gzip.pipe(fs.createWriteStream(targetFilePath));
                                        }
                                    });
                                }
                            });
                        }
                        else{
                            sourceFileStream.pipe(response);
                        }
                    }

                    // First, check if the user accepts gzipped data.
                    if (request.headers['accept-encoding'] && request.headers['accept-encoding'].indexOf('gzip') > -1) {
                        var compressedFile = targetFilePath + conf.get('file.extensions.gzip');
                        // Check if the compressed version of the file already exists.
                        fs.exists(compressedFile, function (exists) {
                            if (exists) {
                                response.setHeader('Content-Encoding', 'gzip');
                                // The stream will close the response automatically.
                                fs.createReadStream(compressedFile).pipe(response);
                            }
                            else{
                                processFile();
                            }
                        });
                    }
                    else{
                        processFile();
                    }
                }
            }
        });
    };
});