// this jsFileHandler performs minification of a JS file.
// this module does not validate the request.url. The calling fileHandler
// module should pass this module only .js file requests.
define(['path', 'conf', 'fs', 'uglify-js2', 'error_handler', 'gzip', 'mkdirp', 'moment'], function (path, conf, fs, uglify, error_handler, gzip, mkdirp, moment) {
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

        fs.stat(sourceFile, function (err, stat) {
            if (err) {
                console.log(sourceFile + ' could not be found.');
                error_handler.handle(request, response, err);
            }
            else{
                var etag = stat.ino + '-' + stat.size + '-' + Date.parse(stat.mtime),
                    targetDir = path.join(conf.dir.jsCompiled, fileName),
                    targetFileName = etag + '.js',
                    targetFile = path.join(targetDir, targetFileName);

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

                    function returnData (data) {
                        response.setHeader('ETag', etag);
                        response.statusCode = 200;
                        response.end(data);
                    }

                    function processFile() {
                        // try to read uncompressed but compiled file
                        fs.readFile(targetFile, function (err, data) {
                            if (err) {
                                // if compiled file also doesn't exist, then
                                // read the source file.
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
                                            targetFile += conf.file.extensions.gzip;
                                        }

                                        // first return the response to the browser.
                                        // let it start doing its job.
                                        // then take care of saving the compiled JS
                                        // to the file.
                                        returnData(data);

                                        // make sure the target directory exists
                                        fs.exists(targetDir, function (exists) {
                                            if (exists) {
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

                                                saveToFile(targetFile, data);
                                            }
                                            else {
                                                mkdirp(targetDir, '0755', function(err) {
                                                    if (err) {
                                                        console.log('Could not create ' + targetDir + ' directory.');
                                                    }
                                                    else{
                                                        saveToFile(targetFile, data);
                                                    }
                                                });
                                            }
                                        });
                                    });
                                });
                            }
                            else{
                                returnData(data);
                            }
                        });
                    }

                    // first, check if user accepts gzipped data
                    if (request.headers['accept-encoding'] && request.headers['accept-encoding'].indexOf('gzip') > -1) {
                        fs.readFile(targetFile + conf.file.extensions.gzip, function (err, data) {
                            if (err) {
                                processFile();
                            }
                            else{
                                response.setHeader('Content-Encoding', 'gzip');
                                returnData(data);
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