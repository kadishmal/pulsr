// this sourceFileHandler converts a LESS file to a valid CSS file, optionally minifies it.
define(['path', 'conf', 'fs', 'less', 'error_handler', 'gzip', 'mkdirp', 'moment'], function (path, conf, fs, less, error_handler, gzip, mkdirp, moment) {
    function saveToFile(file, data) {
        fs.writeFile(file, data, function(err) {
            if (err) {
                console.log('Could not save compiled file to ' + file + '.');
            }
        });
    }

    return function (request, response, options) {
        var fileName = request.url.substring(request.url.lastIndexOf('/') + 1, request.url.lastIndexOf('.')),
            sourceFile = path.join(conf.dir.less, request.url.substring(request.url.lastIndexOf('/') + 1));

        fs.stat(sourceFile, function (err, stat) {
            if (err) {
                console.log(sourceFile + ' could not be found.');
                error_handler.handle(request, response, err);
            }
            else{
                var etag = stat.ino + '-' + stat.size + '-' + Date.parse(stat.mtime),
                    targetDir = path.join(conf.dir.lessCompiled, fileName),
                    targetFileName = etag + '.css',
                    targetFile = path.join(targetDir, targetFileName);

                if (conf.file.handlerOptions[conf.file.extensions.less].cache) {
                    response.setHeader('Cache-Control', 'max-age=' + conf.app.cache.maxage);
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
                    response.setHeader('Content-Type', 'text/css; charset=UTF-8');

                    function returnData (data) {
                        response.setHeader('ETag', etag);
                        response.statusCode = 200;
                        response.end(data);
                    }

                    function processFile() {
                        fs.readFile(targetFile, function (err, data) {
                            if (err) {
                                // if compressed file also doesn't exist, then
                                // read the source file.
                                fs.readFile(sourceFile, 'utf8', function(err, data) {
                                    less.render(data, {compress: options.compress}, function (err, css) {
                                        if (err) {
                                            // simply send unprocessed LESS
                                            returnData(data);
                                        }
                                        else{
                                            data = css;

                                            gzip.compressLESS(request, data, function (compressedData) {

                                                if (compressedData !== undefined) {
                                                    data = compressedData;
                                                    response.setHeader('Content-Encoding', 'gzip');
                                                    // add .gz extension to gzipped files according to
                                                    // http://stackoverflow.com/a/9806694/556678
                                                    targetFileName += conf.file.extensions.gzip;
                                                    targetFile += conf.file.extensions.gzip;
                                                }

                                                // first return the response to the browser.
                                                // let it start doing its job.
                                                // then take care of saving the compiled CSS
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
                                        }
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