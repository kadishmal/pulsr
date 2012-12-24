/*
 * js.js
 * A JavaScript file Handler that minifies, uglifies and gzips JS files
 * requested by a client.
 * This module does not validate the request.url. The parent fileHandler.js
 * module should pass this module only .js file requests.
 */
define(['path', 'conf', 'fs', 'uglify-js', 'error_handler', 'gzip', 'mkdirp', 'moment', 'fileCache'], function (path, conf, fs, uglify, error_handler, gzip, mkdirp, moment, fileCache) {
    function saveToFile(file, data) {
        fs.writeFile(file, data, function(err) {
            if (err) {
                console.log('Could not save compiled file to ' + file + '.');
            }
        });
    }

    return function (request, response, options) {
        var fileName = request.url.substring(request.url.lastIndexOf('/') + 1, request.url.lastIndexOf('.')),
            sourceFile = request.url.substring(1); // remove the front / slash for relative path

        fileCache.stats.get(sourceFile, function (err, stat) {
            if (err) {
                console.log(sourceFile + ' could not be found.');
                error_handler.handle(request, response, err);
            }
            else{
                var etag = stat.ino + '-' + stat.size + '-' + Date.parse(stat.mtime),
                    targetDir = path.join(conf.dir.jsCompiled, fileName),
                    targetFileName = etag + '.js',
                    targetFilePath = path.join(targetDir, targetFileName);

                if (conf.file.handlerOptions[conf.file.extensions.js].cache) {
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
                    response.setHeader('Content-Type', 'application/javascript');
                    response.setHeader('ETag', etag);
                    response.statusCode = 200;

                    function processFile() {
                        // try to read uncompressed but compiled file
                        fs.exists(targetFilePath, function (exists) {
                            if (exists) {
                                // the stream will close the response automatically
                                fs.createReadStream(targetFilePath).pipe(response);
                            }
                            else{
                                // if compiled file also doesn't exist, then
                                // read the source file and compile it.
                                fs.readFile(sourceFile, function (err, data) {
                                    if (conf.file.handlerOptions[conf.file.extensions.js].minify) {
                                        // Compiled JS file hasn't been found, so read the source
                                        // again and compile/minify it.
                                        data = uglify.minify(data.toString(), {fromString: true}).code;
                                    }

                                    gzip.compressJS(request, data, function (compressedData) {
                                        if (compressedData !== undefined) {
                                            data = compressedData;
                                            response.setHeader('Content-Encoding', 'gzip');
                                            // add .zz extension to gzipped files according to
                                            // http://stackoverflow.com/a/9806694/556678
                                            targetFileName += conf.file.extensions.gzip;
                                            targetFilePath += conf.file.extensions.gzip;
                                        }

                                        // first return the response to a client.
                                        // let it start doing its job.
                                        // then take care of saving the compiled JS
                                        // to the file.
                                        response.end(data);

                                        // make sure the target directory exists
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
                        });
                    }

                    // first, check if user accepts gzipped data
                    if (request.headers['accept-encoding'] && request.headers['accept-encoding'].indexOf('gzip') > -1) {
                        var compressedFile = targetFilePath + conf.file.extensions.gzip;

                        fs.exists(compressedFile, function (exists) {
                            if (exists) {
                                response.setHeader('Content-Encoding', 'gzip');
                                // the stream will close the response automatically
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