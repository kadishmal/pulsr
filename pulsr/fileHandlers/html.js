// A file handler that gzips HTML files requested by a client.
// This module does not validate the request.url. The parent fileHandler.js
// module should pass this module only *.html* file requests.
define(['path', 'conf', 'fs', 'error_handler', 'gzip', 'mkdirp', 'moment', 'fileCache'], function (path, conf, fs, error_handler, gzip, mkdirp, moment, fileCache) {
    function saveToFile(file, data) {
        fs.writeFile(file, data, function(err) {
            if (err) {
                console.log('Could not save compiled file to ' + file + '.');
            }
        });
    }

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
                    targetDir = path.join(conf.dir.htmlCompiled, fileName),
                    targetFileName = etag + '.js',
                    targetFilePath = path.join(targetDir, targetFileName);

                if (conf.file.handlerOptions[conf.file.extensions.html].cache) {
                    response.setHeader('Cache-Control', 'public, max-age=' + conf.app.cache.maxage);
                    response.setHeader('Expires', moment(stat.mtime).add('months', 3).utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ'));
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
                        // Read the source file and compress it.
                        fs.readFile(sourceFile, function (err, data) {
                            gzip.compressJS(request, data, function (compressedData) {
                                if (compressedData !== undefined) {
                                    data = compressedData;
                                    response.setHeader('Content-Encoding', 'gzip');
                                    targetFileName += conf.file.extensions.gzip;
                                    targetFilePath += conf.file.extensions.gzip;
                                }

                                // First return the response to the client.
                                // Let the browser start doing its job.
                                // Then take care of saving the compressed HTML to a file.
                                response.end(data);

                                // Make sure the target directory exists
                                fs.exists(targetDir, function (exists) {
                                    if (exists) {
                                        // remove old compiled files
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

                                        saveToFile(targetFilePath, data);
                                    }
                                    else {
                                        mkdirp(targetDir, '0755', function(err) {
                                            if (err) {
                                                console.log('Could not create ' + targetDir + ' directory.');
                                            }
                                            else{
                                                saveToFile(targetFilePath, data);
                                            }
                                        });
                                    }
                                });
                            });
                        });
                    }

                    // First, check if the user accepts gzipped data.
                    if (request.headers['accept-encoding'] && request.headers['accept-encoding'].indexOf('gzip') > -1) {
                        var compressedFile = targetFilePath + conf.file.extensions.gzip;
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
                        console.log('Gzip seems to be disabled for this user request:');
                        console.log(request);
                        processFile();
                    }
                }
            }
        });
    };
});